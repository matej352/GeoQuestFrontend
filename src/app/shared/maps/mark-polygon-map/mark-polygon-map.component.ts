import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { TaskViewMode } from 'src/app/enums/task-view-mode';
import { IMapConfig } from 'src/app/models/map-config';
import { mapType } from 'src/app/types/types';

@Component({
  selector: 'app-mark-polygon-map',
  templateUrl: './mark-polygon-map.component.html',
  styleUrls: ['./mark-polygon-map.component.scss'],
})
export class MarkPolygonMapComponent
  implements OnInit, OnChanges, AfterViewInit
{
  private polygonDrawn: boolean = false;

  @Input() mapType!: mapType;
  @Input() config!: IMapConfig;

  @Input()
  mapId!: string;

  // kad se koristi u TaskViewMode.Solving onda je to odgovor ucenika, kad se koristi u  TaskViewMode.DraftExamPreview onda je to tocan odg kojeg je oznacio ucitelj
  @Input()
  answer!: string;

  @Input()
  correctAnswer!: string; //used when TaskViewMode.Result

  @Input()
  currentUserRole!: number;

  studentAnswerPolygon: L.Polygon | null = null;

  @Input()
  mode = TaskViewMode.DraftExamPreview;

  @Output()
  onPolygonMarked: EventEmitter<any> = new EventEmitter();

  map!: L.Map;
  marker: L.Marker | null = null;
  tileLayer!: L.TileLayer; // Store the current tile layer

  drawnItem = new L.FeatureGroup();
  drawControl!: L.Control.Draw;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mapType'] && !changes['mapType'].firstChange) {
      this.updateMapTiles();
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.config) {
      const [latitude, longitude] = this.config.mapCenter
        .split(',')
        .map((coord) => parseFloat(coord));

      this.map = L.map(this.mapId, {
        center: [latitude, longitude],
        zoom: this.config.mapZoomLevel,
      });
    } else {
      this.map = L.map(this.mapId, {
        center: [44.5, 16],
        zoom: 8,
      });
    }

    this.map.addLayer(this.drawnItem);

    this.updateMapTiles(); // Ensure tiles are added when the map initializes

    //slucaj da ucitelj radi novi zadatak
    if (this.mapId === 'mark_polygon') {
      this.initializeMap();
      console.log('Mapa MARK POLYGON --> radi se novi zadatak');
    }
    //slucaj da student rjesava zadatak
    else if (this.mode === TaskViewMode.Solving) {
      this.initializeMap();
      if (this.answer) {
        const coordinates = JSON.parse(this.answer);
        const latLngs = coordinates.map((coord: { lat: number; lng: number }) =>
          L.latLng(coord.lat, coord.lng)
        );
        this.studentAnswerPolygon = L.polygon(latLngs);

        const polygonLayer = this.studentAnswerPolygon.addTo(this.map);

        // Disable drawing controls
        this.map.removeControl(this.drawControl);

        // Create a delete button for the polygon
        const deleteButton = L.DomUtil.create('button', 'delete-button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.addEventListener('click', () => {
          this.map.removeLayer(polygonLayer); // Delete the polygon when the delete button is clicked
          this.map.addControl(this.drawControl);
          setTimeout(() => {
            this.emitDrawnItemChange();
          }, 100);
        });

        // Create a popup and bind it to the polygon layer
        polygonLayer.bindPopup(deleteButton);
      }
      console.log('Mapa MARK POLYGON --> student rjesava zadatak');
    }
    //slucaj da ucitelj gleda skicu ispita sa pripadnim zadacima
    else if (this.mode === TaskViewMode.DraftExamPreview) {
      const coordinates = JSON.parse(this.answer);
      const latLngs = coordinates.map((coord: { lat: number; lng: number }) =>
        L.latLng(coord.lat, coord.lng)
      );
      L.polygon(latLngs).addTo(this.map);

      console.log('Mapa MARK POLYGON --> ucitelj gleda skicu ispita ');
    } else if (this.mode === TaskViewMode.Result) {
      this.prepareResultView();

      console.log(
        'Mapa MARK POINT --> ucitelj/student gledaju rezultat ispita'
      );
    }
  }
  prepareResultView() {
    // Parse coordinates from JSON strings
    const studentCoordinates = JSON.parse(this.answer);
    const correctCoordinates = JSON.parse(this.correctAnswer);

    // Convert coordinates to LatLng objects
    const studentLatLngs = this.parseCoordinatesToLatLng(studentCoordinates);
    const correctLatLngs = this.parseCoordinatesToLatLng(correctCoordinates);

    // Create polygons for student answer and correct answer
    const studentPolygon = this.createPolygon(studentLatLngs);
    const correctPolygon = this.createPolygon(correctLatLngs, {
      fillColor: 'green',
      color: 'green',
      fillOpacity: 0.4,
    });

    // Add polygons to the map
    this.addPolygonToMap(
      studentPolygon,
      this.currentUserRole === 0 ? 'Učenikov odgovor' : 'Vaš odgovor'
    );
    this.addPolygonToMap(correctPolygon, 'Točan odgovor');
  }

  // Helper function to convert coordinates to LatLng objects
  private parseCoordinatesToLatLng(coordinates: any[]): L.LatLng[] {
    return coordinates.map((coord) => L.latLng(coord.lat, coord.lng));
  }

  // Helper function to create a polygon with optional style
  private createPolygon(latlngs: L.LatLng[], style?: any): L.Polygon {
    const polygon = L.polygon(latlngs);
    if (style) {
      polygon.setStyle(style);
    }
    return polygon;
  }

  // Helper function to add polygon to the map with a popup
  private addPolygonToMap(polygon: L.Polygon, popupText: string) {
    polygon.addTo(this.map);
    polygon.bindPopup(popupText);
    polygon.on('click', () => {
      polygon.openPopup();
    });
  }

  private initializeMap(): void {
    this.drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          allowIntersection: true,
          showArea: true,
        },
        marker: false, // Disable other drawing tools
        circle: false,
        circlemarker: false,
        polyline: false,
        rectangle: false,
      },
    });
    this.map.addControl(this.drawControl);

    if (!this.polygonDrawn) {
      this.map.on(L.Draw.Event.CREATED, (event: any) => {
        //console.log(event);
        const layer = event.layer;

        (layer as CustomLayer).properties = {
          // Add your custom properties here
          name: 'My Polygon',
          description: 'This is a drawn polygon',
        };

        setTimeout(() => {
          this.emitDrawnItemChange();
        }, 100);

        // Create a delete button for the polygon
        const deleteButton = L.DomUtil.create('button', 'delete-button');
        deleteButton.innerHTML = 'Obriši';
        deleteButton.addEventListener('click', () => {
          this.deletePolygon(layer, this.drawnItem); // Delete the polygon when the delete button is clicked
          this.polygonDrawn = false; // Reset flag after deleting polygon

          // Re-enable drawing controls
          this.map.addControl(this.drawControl);
        });

        // Add the delete button to the polygon
        layer.bindPopup(deleteButton);

        this.drawnItem.addLayer(layer);

        this.polygonDrawn = true; // Set flag to true after drawing the first polygon

        // Disable drawing controls
        this.map.removeControl(this.drawControl);
      });

      this.drawnItem.on('click', (event: any) => {
        //console.log(event.layer.properties); // Access the custom properties
      });
    }
  }

  private updateMapTiles(): void {
    if (this.map && this.tileLayer) {
      this.map.removeLayer(this.tileLayer); // Remove the previous tile layer
    }

    switch (this.mapType) {
      case 'blind':
        this.tileLayer = L.tileLayer(
          'https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png',
          {
            maxZoom: 20,
            minZoom: 2,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://www.openstreetmap.bzh/" target="_blank">Breton OpenStreetMap Team</a>',
          }
        );
        break;
      case 'satellite':
        this.tileLayer = L.tileLayer(
          'http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',
          {
            maxZoom: 20,
            minZoom: 2,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        );
        break;
      default:
        this.tileLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            minZoom: 2,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }
        );
    }

    this.tileLayer.addTo(this.map);
  }

  deletePolygon(layer: L.Layer, drawnItems: any): void {
    drawnItems.removeLayer(layer); // Remove the layer from the FeatureGroup
    this.emitDrawnItemChange();
  }

  emitDrawnItemChange() {
    const layer = Object.values((this.drawnItem as any)._layers)[0]; // Assuming there's only one layer

    let polygon: { lat: any; lng: any }[] = [];

    if (!layer) {
      this.onPolygonMarked.emit('');
    } else {
      // Access coordinates (_latlngs) of the layer
      const latlngs = (layer as any)._latlngs[0];
      latlngs.forEach((pair: { lat: any; lng: any }) => {
        polygon.push({
          lat: pair.lat,
          lng: pair.lng,
        });
      });

      this.onPolygonMarked.emit(JSON.stringify(polygon));
    }
  }

  getMapCenter(): string {
    let center = this.map.getCenter();
    return `${center.lat},${center.lng}`;
  }

  getZoomLevel(): number {
    return this.map.getZoom();
  }
}

export interface CustomLayer extends L.Layer {
  properties: {
    [key: string]: any; // Define any properties you want to add to the layer
  };
}
