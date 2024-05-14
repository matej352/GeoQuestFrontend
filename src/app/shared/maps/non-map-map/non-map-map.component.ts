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
  selector: 'app-non-map-map',
  templateUrl: './non-map-map.component.html',
  styleUrls: ['./non-map-map.component.scss'],
})
export class NonMapMapComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() mapType!: mapType;
  @Input() config!: IMapConfig;

  @Input()
  mapId!: string;

  @Input()
  answer!: string;

  @Input()
  nonMapPoint!: string;

  @Input()
  mode = TaskViewMode.DraftExamPreview;

  @Output()
  onPointMarked: EventEmitter<any> = new EventEmitter();

  @Output()
  onAnswerSaved: EventEmitter<string> = new EventEmitter();

  map!: L.Map;
  marker: L.Marker | null = null;
  tileLayer!: L.TileLayer; // Store the current tile layer

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mapType'] && !changes['mapType'].firstChange) {
      this.updateMapTiles();
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeMap();

    //slucaj da ucitelj radi novi zadatak
    if (this.mapId === 'non_map') {
      this.initializeClickListener();
    }
    //slucaj da student rjesava zadatak
    else if (this.mode === TaskViewMode.Solving) {
      const [lat, lng] = this.nonMapPoint.split(',').map(Number);
      const marker = L.marker([lat, lng]).addTo(this.map);

      // Create the popup content
      const popupContent = `
      <div class="popup-content">
      <label for="answer">Odgovor:</label>
      <textarea id="answer-non-map" rows="4"></textarea>
      <button id="saveButton">Spremi</button>
    </div>
                            `;

      // Bind the popup to the marker
      marker.bindPopup(popupContent);

      marker.openPopup();

      // Define a variable to store the input value
      let inputValue = '';

      // Listen for the save button click event
      document.addEventListener('click', (event) => {
        const saveButton = event.target as HTMLElement;
        if (saveButton && saveButton.id === 'saveButton') {
          // Retrieve the value of the textarea
          inputValue = (
            document.getElementById('answer-non-map') as HTMLTextAreaElement
          ).value;

          this.onAnswerSaved.emit(inputValue);

          // Close the popup
          marker.closePopup();
        }
      });

      if (this.answer) {
        (
          document.getElementById('answer-non-map') as HTMLTextAreaElement
        ).value = this.answer;
      }

      // Listen for the marker popupopen event to update input value
      marker.on('popupopen', () => {
        // Update the input value with the stored value
        (
          document.getElementById('answer-non-map') as HTMLTextAreaElement
        ).value = inputValue;
      });

      // Listen for the marker popupclose event to update stored value
      marker.on('popupclose', () => {
        // Retrieve the value of the textarea
        inputValue = (
          document.getElementById('answer-non-map') as HTMLTextAreaElement
        ).value;
      });
    }
    //slucaj da ucitelj gleda skicu ispita sa pripadnim zadacima
    else if (this.mode === TaskViewMode.DraftExamPreview) {
      const [lat, lng] = this.nonMapPoint.split(',').map(Number);
      L.marker([lat, lng]).addTo(this.map);
    } else if (this.mode === TaskViewMode.Result) {
      const [lat, lng] = this.nonMapPoint.split(',').map(Number);
      const marker = L.marker([lat, lng]).addTo(this.map);

      // Create the popup content
      const popupContent = `
                          <div class="popup-content">
                            <label for="answer">Odgovor:</label>
                            <div id="answer-non-map"></div>
                          </div>
                            `;

      // Bind the popup to the marker
      marker.bindPopup(popupContent);

      // Listen for the marker popupopen event to update input value
      marker.on('popupopen', () => {
        // Update the input value with the stored value
        (
          document.getElementById('answer-non-map') as HTMLTextAreaElement
        ).innerHTML = this.answer;
      });

      marker.openPopup();
    }
  }

  private initializeClickListener() {
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.handleMapClick(event);
    });
  }

  private handleMapClick(event: L.LeafletMouseEvent): void {
    const { lat, lng } = event.latlng;

    // Remove previous marker if exists
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Add a marker at the clicked location
    this.marker = L.marker([lat, lng]).addTo(this.map);

    this.onPointMarked.emit([lat, lng]);
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

    this.updateMapTiles(); // Ensure tiles are added when the map initializes
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

  getMapCenter(): string {
    let center = this.map.getCenter();
    return `${center.lat},${center.lng}`;
  }

  getZoomLevel(): number {
    return this.map.getZoom();
  }
}
