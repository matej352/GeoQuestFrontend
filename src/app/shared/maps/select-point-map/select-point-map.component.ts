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
import { IOptionAnwser } from 'src/app/models/option-anwser';
import { IOptionAnswerDto } from 'src/app/models/taskDto';
import { ITaskInstanceOptionAnswerDto } from 'src/app/models/taskInstanceDto';
import { ITestTaskOptionAnswerResult } from 'src/app/models/test-instance-result';
import { mapType } from 'src/app/types/types';

@Component({
  selector: 'app-select-point-map',
  templateUrl: './select-point-map.component.html',
  styleUrls: ['./select-point-map.component.scss'],
})
export class SelectPointMapComponent implements AfterViewInit, OnChanges {
  @Input() mapType!: mapType;
  @Input() config!: IMapConfig;

  @Input()
  mapId!: string;

  // if type is IOptionAnswerDto --> map opened in view mode, if type is ITaskInstanceOptionAnswerDto --> map opened in solving mode, if type is ITestTaskOptionAnswerResult --> map opened in result mode
  @Input()
  answers!:
    | IOptionAnswerDto[]
    | ITaskInstanceOptionAnswerDto[]
    | ITestTaskOptionAnswerResult[];

  // ovo je answer studenta kad je exam ongoing
  @Input()
  answer!: number | null;

  @Input()
  correctAnswer!: number; //used when TaskViewMode.Result

  @Input()
  mode = TaskViewMode.DraftExamPreview;

  @Input()
  currentUserRole!: number;

  private map!: L.Map;
  tileLayer!: L.TileLayer; // Store the current tile layer
  drawnMarkers: CustomMarker[] = [];

  selectedPointId: number | null = null;
  selectedPoint: L.Marker | null = null;

  @Output()
  onDrawnItemsChange: EventEmitter<any> = new EventEmitter();

  @Output()
  onPointSelected: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mapType'] && !changes['mapType'].firstChange) {
      this.updateMapTiles();
    }
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
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

    this.updateMapTiles();

    // FeatureGroup is to store editable layers

    //slucaj da ucitelj radi novi zadatak
    if (this.mapId === 'select_point') {
      this.map.on('click', (e) => {
        // Get the clicked coordinates
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;

        // Create a marker at the clicked coordinates
        var marker = L.marker([lat, lng]).addTo(this.map) as CustomMarker;

        setTimeout(() => {
          this.emitDrawnMarkersChange();
        }, 100);

        this.drawnMarkers.push(marker); // Add the marker to the markers array

        // Create buttons for the marker
        const deleteButton = L.DomUtil.create('button', 'delete-button');
        deleteButton.innerHTML = 'Obriši';
        deleteButton.addEventListener('click', () => {
          this.deleteMarker(marker); // Delete the marker when the delete button is clicked
        });

        // Create a toggle button for the marker
        const toggleButton = document.createElement('input');
        toggleButton.type = 'checkbox';
        toggleButton.checked = false; // Default value for the toggle button

        // Add change event listener to the toggle button
        toggleButton.addEventListener('change', (event) => {
          const isChecked = (event.target as HTMLInputElement).checked;
          marker['isCorrect'] = isChecked; // Update the 'isCorrect' property of the marker
          this.emitDrawnMarkersChange();
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

        // Add the delete button to the popup content
        popupContent.appendChild(deleteButton);

        // Add the popup to the marker
        marker.bindPopup(popupContent).openPopup();
      });
    }

    //slucaj da student rjesava zadatak
    else if (this.mode === TaskViewMode.Solving) {
      this.initializeMapForSolving();
    }

    //slucaj da ucitelj gleda skicu ispita sa pripadnim zadacima
    else if (this.mode === TaskViewMode.DraftExamPreview) {
      let studentAnsweredCorrectly = false;

      this.answers.forEach((obj) => {
        // Parse the content to extract coordinates
        const coordinates = JSON.parse(obj.content);

        const marker = L.marker([coordinates.lat, coordinates.lng]);

        // Add polygon to map
        marker.addTo(this.map);
      });
    } else if (this.mode === TaskViewMode.Result) {
      let studentAnsweredCorrectly = false;

      if (this.answer === this.correctAnswer) {
        studentAnsweredCorrectly = true;
      }

      this.answers.forEach((obj) => {
        // Parse the content to extract coordinates
        const { lat, lng } = JSON.parse(obj.content);

        if (
          studentAnsweredCorrectly &&
          (obj as ITestTaskOptionAnswerResult).correct
        ) {
          const marker = L.marker([lat, lng], {
            icon: L.icon({
              iconUrl: 'assets/marker-correct-icon.png',
              iconSize: [25, 39], // Default Leaflet icon size
              iconAnchor: [12, 41], // Default Leaflet icon anchor
              popupAnchor: [1, -34], // Default Leaflet popup anchor
            }),
          }).addTo(this.map);

          marker.bindPopup('Točan odgovor');

          marker.on('click', () => {
            marker.openPopup();
          });
          marker.openPopup();
        } else if (
          !studentAnsweredCorrectly &&
          (obj as ITestTaskOptionAnswerResult).correct
        ) {
          const marker = L.marker([lat, lng], {
            icon: L.icon({
              iconUrl: 'assets/marker-correct-icon.png',
              iconSize: [25, 39], // Default Leaflet icon size
              iconAnchor: [12, 41], // Default Leaflet icon anchor
              popupAnchor: [1, -34], // Default Leaflet popup anchor
            }),
          }).addTo(this.map);
          marker.bindPopup('Točan odgovor');

          marker.on('click', () => {
            marker.openPopup();
          });
          marker.addTo(this.map);
        } else if (
          !studentAnsweredCorrectly &&
          (obj as ITestTaskOptionAnswerResult).id === this.answer
        ) {
          const marker = L.marker([lat, lng]);
          marker.bindPopup(
            this.currentUserRole === 0 ? 'Učenikov odgovor' : 'Vaš odgovor'
          );

          marker.on('click', () => {
            marker.openPopup();
          });
          marker.addTo(this.map);
          marker.openPopup();
        } else {
          const marker = L.marker([lat, lng]);
          marker.addTo(this.map);
        }
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

  initializeMapForSolving() {
    this.answers.forEach((answer) => {
      const { lat, lng } = JSON.parse(answer.content);
      const marker = L.marker([lat, lng], {
        icon: this.getDefaultIcon(),
      }).addTo(this.map);
      marker.on('click', () =>
        this.handleMarkerClick(
          (answer as ITaskInstanceOptionAnswerDto).id,
          marker
        )
      );
      marker.on('mouseover', () => this.handleMarkerHover(marker));
      marker.on('mouseout', () => this.handleMarkerMouseOut(marker));

      if (this.answer) {
        if ((answer as ITaskInstanceOptionAnswerDto).id === this.answer) {
          marker.fireEvent('click');
        }
      }
    });
  }

  private handleMarkerClick(optionId: number, marker: L.Marker): void {
    // Deselect previously selected marker if exists
    if (this.selectedPoint) {
      this.selectedPoint.setIcon(this.getDefaultIcon());
    }

    if (!this.answer) {
      this.onPointSelected.emit(optionId);
    }
    this.answer = null;

    // Select the clicked marker
    this.selectedPoint = marker;
    marker.setIcon(this.getSelectedIcon());
  }

  private handleMarkerHover(marker: L.Marker): void {
    if (marker !== this.selectedPoint) {
      marker.setIcon(this.getHoveredIcon());
    }
  }

  private handleMarkerMouseOut(marker: L.Marker): void {
    if (marker !== this.selectedPoint) {
      marker.setIcon(this.getDefaultIcon());
    }
  }

  private getDefaultIcon(): L.Icon {
    return L.icon({
      iconUrl: 'assets/marker-icon.png',
      iconSize: [25, 39],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }

  private getSelectedIcon(): L.Icon {
    return L.icon({
      iconUrl: 'assets/marker-correct-icon.png',
      iconSize: [25, 39],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  }

  private getHoveredIcon(): L.Icon {
    return L.icon({
      iconUrl: 'assets/marker-icon.png',
      iconSize: [30, 46], // Larger size for hover effect
      iconAnchor: [15, 48], // Adjusted anchor for larger size
      popupAnchor: [1, -34],
    });
  }

  deleteMarker(marker: CustomMarker) {
    // Remove the marker from the map
    this.map.removeLayer(marker);

    // Remove the marker from the markers array
    const index = this.drawnMarkers.indexOf(marker);
    if (index !== -1) {
      this.drawnMarkers.splice(index, 1);
    }

    this.emitDrawnMarkersChange();
  }

  emitDrawnMarkersChange() {
    let items: IOptionAnwser[] = [];

    this.drawnMarkers.forEach((marker) => {
      const latlng = marker.getLatLng(); // Get the marker's coordinates

      let item: IOptionAnwser = {
        properties: {
          name: '',
          description: '',
          isCorrect: marker.isCorrect ?? false,
        },
        type: 'Point',
        coordinates: {
          lat: latlng.lat,
          lng: latlng.lng,
        },
      };

      items.push(item);
    });

    this.onDrawnItemsChange.emit(items);
  }

  getMapCenter(): string {
    let center = this.map.getCenter();
    return `${center.lat},${center.lng}`;
  }

  getZoomLevel(): number {
    return this.map.getZoom();
  }
}

export interface CustomMarker extends L.Marker {
  isCorrect: boolean;
}
