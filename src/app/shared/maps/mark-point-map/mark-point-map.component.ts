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
import {
  mapType,
  taskType,
} from 'src/app/pages/exams-page/exam/create-task-card/create-task-card.component';
import { MarkerService } from 'src/app/services/map-services/marker.service';
import { ShapeService } from 'src/app/services/map-services/shape.service';

import 'leaflet-draw'; // Import Leaflet.Draw

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-mark-point-map',
  templateUrl: './mark-point-map.component.html',
  styleUrls: ['./mark-point-map.component.scss'],
})
export class MarkPointMapComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() mapType!: mapType;

  @Input()
  mapId!: string;

  @Input()
  answer!: string;

  studentAnswerMarker: L.Marker | null = null;

  @Input()
  mode = 'draft_exam_preview';

  @Output()
  onPointMarked: EventEmitter<any> = new EventEmitter();

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
    if (this.mapId === 'mark_point') {
      this.initializeClickListener();
      console.log('Mapa MARK POINT --> radi se novi zadatak');
    }
    //slucaj da student rjesava zadatak
    else if (this.mode === 'solving') {
      this.initializeClickListener();
      if (this.answer) {
        const [lat, lng] = this.answer.split(',').map(Number);
        this.studentAnswerMarker = L.marker([lat, lng]).addTo(this.map);
      }
      console.log('Mapa MARK POINT --> student rjesava zadatak');
    }
    //slucaj da ucitelj gleda skicu ispita sa pripadnim zadacima
    else if (this.mode === 'draft_exam_preview') {
      const [lat, lng] = this.answer.split(',').map(Number);
      L.marker([lat, lng]).addTo(this.map);
      console.log('Mapa MARK POINT --> ucitelj gleda skicu ispita ');
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

    if (this.studentAnswerMarker && this.mode === 'solving') {
      this.map.removeLayer(this.studentAnswerMarker);
    }

    // Add a marker at the clicked location
    this.marker = L.marker([lat, lng]).addTo(this.map);

    this.onPointMarked.emit([lat, lng]);

    // Do whatever you need with the coordinates (lat, lng)
    console.log(`Clicked at: ${lat}, ${lng}`);
  }

  private initializeMap(): void {
    this.map = L.map(this.mapId, {
      center: [44.5, 16],
      zoom: 8,
    });
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
}
