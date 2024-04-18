import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from 'src/app/services/map-services/marker.service';
import { ShapeService } from 'src/app/services/map-services/shape.service';
import { mapType } from 'src/app/types/types';

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
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input()
  mapType!: mapType;

  map: any;
  zupanije: any;

  zupanijePool: any;
  zupanijaToSelect = null;

  constructor(
    private markerService: MarkerService,
    private shapeService: ShapeService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makeCapitalMarkers(this.map);

    this.shapeService.getStateShapes().subscribe((shapes) => {
      this.zupanije = shapes;
      this.zupanijePool = (shapes as any).features.map(
        (item: any) => item.properties.name
      );
      this.initStatesLayer();
      this.getNextZupanijaQuestion();
    });
  }

  private initMap(): void {
    var tiles;

    switch (this.mapType) {
      case 'blind':
        this.map = L.map('map', {
          center: [44.5, 16],
          zoom: 8,
        });
        tiles = L.tileLayer(
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
        this.map = L.map('map', {
          center: [39.8282, -98.5795],
          zoom: 3,
        });
        tiles = L.tileLayer(
          'http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',
          {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }
        );
        break;
      default:
        this.map = L.map('map', {
          center: [39.8282, -98.5795],
          zoom: 3,
        });
        tiles = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            minZoom: 3,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }
        );
    }

    tiles.addTo(this.map);

    L.marker([50.5, 30.5]).addTo(this.map);
  }

  private highlightFeature(e: L.LeafletMouseEvent) {
    const layer = e.target;
    console.log(e.target.feature.properties.name);

    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: '#DFA612',
      fillOpacity: 1.0,
      fillColor: '#FAE042',
    });
  }

  private resetFeature(e: L.LeafletMouseEvent) {
    const layer = e.target;

    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B',
    });
  }

  private initStatesLayer(): void {
    const stateLayer = L.geoJSON(this.zupanije, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B',
      }),
      onEachFeature: (feature, layer) =>
        layer.on({
          mouseover: (e) => this.highlightFeature(e),
          mouseout: (e) => this.resetFeature(e),
          click: (e) => {
            if (e.target.feature.properties.name === this.zupanijaToSelect) {
              this.getNextZupanijaQuestion();
              stateLayer.removeLayer(layer);
            }
          },
        }),
    });

    this.map.addLayer(stateLayer);
  }

  getNextZupanijaQuestion() {
    this.zupanijaToSelect = this.getRandomItemAndRemove();
  }

  getRandomItemAndRemove() {
    // Check if the array is empty
    if (this.zupanijePool.length === 0) {
      return null; // If the array is empty, return null
    }

    // Generate a random index within the array length
    const randomIndex = Math.floor(Math.random() * this.zupanijePool.length);

    // Get the random item from the array using the random index
    const randomItem = this.zupanijePool[randomIndex];

    // Remove the random item from the array
    this.zupanijePool.splice(randomIndex, 1);
    this.zupanije.features.splice(randomIndex, 1);

    // Return the randomly selected item
    return randomItem;
  }
}
