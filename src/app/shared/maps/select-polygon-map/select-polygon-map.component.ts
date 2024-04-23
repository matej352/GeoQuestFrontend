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
import { IOptionAnwser } from 'src/app/models/option-anwser';
import { IOptionAnswerDto } from 'src/app/models/taskDto';
import { ITaskInstanceOptionAnswerDto } from 'src/app/models/taskInstanceDto';
import { mapType } from 'src/app/types/types';

@Component({
  selector: 'app-select-polygon-map',
  templateUrl: './select-polygon-map.component.html',
  styleUrls: ['./select-polygon-map.component.scss'],
})
export class SelectPolygonMapComponent implements AfterViewInit, OnChanges {
  @Input() mapType!: mapType;

  @Input()
  mapId!: string;

  @Input()
  answers!: IOptionAnswerDto[] | ITaskInstanceOptionAnswerDto[]; // if type is IOptionAnswerDto --> map opened in view mode, if type is ITaskInstanceOptionAnswerDto --> map opened in solving mode

  // ovo je answer studenta kad je exam ongoing
  @Input()
  answer!: number;

  @Input()
  mode = TaskViewMode.DraftExamPreview;

  private map!: L.Map;
  tileLayer!: L.TileLayer; // Store the current tile layer
  drawnItems = new L.FeatureGroup();

  selectedPolygonId: number | null = null;
  selectedPolygon: L.Polygon | null = null;

  @Output()
  onDrawnItemsChange: EventEmitter<any> = new EventEmitter();

  @Output()
  onPolygonSelected: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mapType'] && !changes['mapType'].firstChange) {
      this.updateMapTiles();
    }
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  deletePolygon(layer: L.Layer, drawnItems: any): void {
    drawnItems.removeLayer(layer); // Remove the layer from the FeatureGroup
  }

  private initializeMap(): void {
    this.map = L.map(this.mapId, {
      center: [44.5, 16],
      zoom: 8,
    });

    this.updateMapTiles();

    // FeatureGroup is to store editable layers

    //slucaj da ucitelj radi novi zadatak
    if (this.mapId === 'select_polygon') {
      console.log('Mapa SELECT POLYGON --> radi se novi zadatak');

      this.map.addLayer(this.drawnItems);

      var drawControl = new L.Control.Draw({
        draw: {
          polygon: {
            allowIntersection: true,
            showArea: true,
          },
          marker: false, // Disable other drawing tools
          circle: {},
          circlemarker: false,
          polyline: false,
          rectangle: false,
        },
        edit: {
          featureGroup: this.drawnItems, // Enable editing of drawn polygons
          remove: false,
        },
      });
      this.map.addControl(drawControl);

      this.map.on(L.Draw.Event.CREATED, (event: any) => {
        //console.log(this.drawnItems);

        const layer = event.layer;

        (layer as CustomLayer).properties = {
          // Add your custom properties here
          name: 'My Polygon',
          description: 'This is a drawn polygon',
          isCorrect: false,
        };

        setTimeout(() => {
          this.emitDrawnItemsChange();
        }, 100);

        // Create a delete button for the polygon
        const deleteButton = L.DomUtil.create('button', 'delete-button');
        deleteButton.innerHTML = 'Obriši';
        deleteButton.addEventListener('click', () => {
          this.deletePolygon(layer, this.drawnItems); // Delete the polygon when the delete button is clicked

          this.emitDrawnItemsChange();
        });

        // Create a toggle button for the polygon
        const toggleButton = document.createElement('input');
        toggleButton.type = 'checkbox';
        toggleButton.checked = false; // Default value for the toggle button

        toggleButton.addEventListener('change', (event) => {
          const isChecked = (event.target as HTMLInputElement).checked;
          (layer as CustomLayer).properties['isCorrect'] = isChecked; // Update the selected property

          this.emitDrawnItemsChange();
        });

        // Create a container element for the popup content
        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-container');

        // Add the toggle button to the popup content
        const toggleLabel = document.createElement('label');
        toggleLabel.classList.add('toggle-label');
        toggleLabel.textContent = 'Točan odgovor?';
        popupContent.appendChild(toggleLabel);
        popupContent.appendChild(toggleButton);

        // Add the description text
        const description = document.createElement('p');
        description.textContent = 'Custom description goes here';
        //popupContent.appendChild(description);  Ovo nisam iskoristio

        // Add the delete button to the popup content
        popupContent.appendChild(deleteButton);

        // Add the delete button to the polygon
        layer.bindPopup(popupContent);

        this.drawnItems.addLayer(layer);
      });

      this.map.on(L.Draw.Event.EDITED, (event: any) => {
        this.emitDrawnItemsChange();
      });

      this.drawnItems.on('click', (event: any) => {
        console.log(event.layer.properties); // Access the custom properties
      });
    }

    //slucaj da student rjesava zadatak
    else if (this.mode === TaskViewMode.Solving) {
      console.log('Mapa SELECT POLYGON --> student rjesava zadatak');
      this.initializeMapForSolving();
    }

    //slucaj da ucitelj gleda skicu ispita sa pripadnim zadacima
    else if (this.mode === TaskViewMode.DraftExamPreview) {
      console.log('Mapa SELECT POLYGON --> ucitelj gleda skicu ispita');

      this.answers.forEach((obj) => {
        // Parse the content to extract coordinates
        const coordinates = JSON.parse(obj.content);

        // Create an array of LatLng objects
        const latLngs = coordinates.map((coord: { lat: number; lng: number }) =>
          L.latLng(coord.lat, coord.lng)
        );

        // Create polygon
        const polygon = L.polygon(latLngs);

        // Add polygon to map
        polygon.addTo(this.map);
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
            maxZoom: 8,
            minZoom: 8,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://www.openstreetmap.bzh/" target="_blank">Breton OpenStreetMap Team</a>',
            bounds: [
              [46.2, 12],
              [42, 20],
            ],
          }
        );
        break;
      case 'satellite':
        this.tileLayer = L.tileLayer(
          'http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',
          {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        );
        break;
      default:
        this.tileLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            minZoom: 3,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }
        );
    }

    this.tileLayer.addTo(this.map);
  }

  emitDrawnItemsChange() {
    //console.log(this.drawnItems);
    let items: IOptionAnwser[] = [];

    Object.values((this.drawnItems as any)._layers).forEach((layer) => {
      let item: IOptionAnwser = {
        properties: {
          name: '',
          description: '',
          isCorrect: false,
        },
        type: 'Polygon',
        coordinates: [],
      };
      // Access properties of the layer
      const properties = (layer as any).properties;
      item.properties = properties;
      //console.log(properties);

      // Access coordinates (_latlngs) of the layer
      const latlngs = (layer as any)._latlngs[0];
      latlngs.forEach((pair: { lat: any; lng: any }) => {
        item.coordinates.push({
          lat: pair.lat,
          lng: pair.lng,
        });
      });
      //console.log(latlngs);

      items.push(item);
    });

    this.onDrawnItemsChange.emit(items);
    //console.log(items);
  }

  initializeMapForSolving() {
    this.answers.forEach((obj) => {
      // Parse the content to extract coordinates
      const coordinates = JSON.parse(obj.content);

      // Create an array of LatLng objects
      const latLngs = coordinates.map((coord: { lat: number; lng: number }) =>
        L.latLng(coord.lat, coord.lng)
      );

      // Create polygon
      const polygon = L.polygon(latLngs);

      // Add polygon to map
      polygon.addTo(this.map);

      polygon.on('mouseover', () => this.onPolygonHover(polygon));
      polygon.on('mouseout', () => this.onPolygonMouseOut(polygon));
      polygon.on('click', () =>
        this.onPolygonClick((obj as ITaskInstanceOptionAnswerDto).id, polygon)
      );

      if (this.answer) {
        if ((obj as ITaskInstanceOptionAnswerDto).id === this.answer) {
          polygon.fireEvent('click');
        }
      }
    });
  }

  onPolygonHover(polygon: L.Polygon): void {
    if (!this.selectedPolygon || this.selectedPolygon !== polygon) {
      polygon.setStyle({
        fillColor: 'lightblue', // or any other color to indicate hover
      });
    }
  }

  onPolygonMouseOut(polygon: L.Polygon): void {
    if (!this.selectedPolygon || this.selectedPolygon !== polygon) {
      this.resetFeature(polygon);
    }
  }

  onPolygonClick(id: number, polygon: L.Polygon): void {
    if (this.selectedPolygon && this.selectedPolygon !== polygon) {
      this.resetPolygonStyle(this.selectedPolygon);
    }

    //emit selectedPolygonId
    this.onPolygonSelected.emit(id);

    this.selectedPolygonId = id;
    this.selectedPolygon = polygon;
    this.highlightPolygon(polygon);
  }

  private highlightPolygon(polygon: L.Polygon): void {
    polygon.setStyle({
      fillColor: 'orange',
      color: 'orange',
    });
  }

  private resetPolygonStyle(polygon: L.Polygon): void {
    polygon.setStyle({
      fillColor: 'rgb(51, 136, 255)', // or whatever your default fill color is
      color: '#3388ff',
    });
  }

  private resetFeature(polygon: L.Polygon): void {
    polygon.setStyle({
      weight: 3,
      opacity: 1,
      color: '#3388ff',
      fillOpacity: 0.2,
      fillColor: 'rgb(51, 136, 255)',
    });
  }
}

export interface CustomLayer extends L.Layer {
  properties: {
    [key: string]: any; // Define any properties you want to add to the layer
  };
}
