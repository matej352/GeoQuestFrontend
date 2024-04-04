import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from 'src/app/services/map-services/marker.service';
import { ShapeService } from 'src/app/services/map-services/shape.service';

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
  selector: 'app-plain-map',
  templateUrl: './plain-map.component.html',
  styleUrls: ['./plain-map.component.scss'],
})
export class PlainMapComponent implements OnInit {
  @Input()
  mapType!: string;

  map: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    //this.markerService.makeCapitalMarkers(this.map);

    /*this.shapeService.getStateShapes().subscribe((shapes) => {
      this.zupanije = shapes;
      this.zupanijePool = (shapes as any).features.map(
        (item: any) => item.properties.name
      );
      this.initStatesLayer();
      this.getNextZupanijaQuestion();
    }); */
  }

  private initMap(): void {
    var tiles;

    switch (this.mapType) {
      case 'blind':
        this.map = L.map('map2', {
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
        this.map = L.map('map2', {
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
        this.map = L.map('map2', {
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
  }
}
