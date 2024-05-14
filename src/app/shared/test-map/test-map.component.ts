import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-test-map',
  templateUrl: './test-map.component.html',
  styleUrls: ['./test-map.component.scss'],
})
export class TestMapComponent implements OnInit {
  private map!: L.Map;

  constructor() {}

  ngOnInit(): void {
    this.initializeMap();
  }
  deletePolygon(layer: L.Layer, drawnItems: any): void {
    drawnItems.removeLayer(layer); // Remove the layer from the FeatureGroup
  }

  private initializeMap(): void {
    var polygon = L.polygon([
      { lat: 45.28165078755851, lng: 15.314941406250002 },
      { lat: 44.78475923091046, lng: 15.249023437500002 },
      { lat: 44.62859586258382, lng: 16.627807617187504 },
      { lat: 45.091944150432724, lng: 16.759643554687504 },
    ]);

    this.map = L.map('map', {
      center: [44.5, 16],
      zoom: 8,
    });

    polygon.addTo(this.map);

    // Define and add tile layers
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
    }).addTo(this.map);

    // FeatureGroup is to store editable layers
    var drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);

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
        featureGroup: drawnItems, // Enable editing of drawn polygons
        remove: false,
      },
    });
    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;

      (layer as CustomLayer).properties = {
        // Add your custom properties here
        name: 'My Polygon',
        description: 'This is a drawn polygon',
      };

      // Create a delete button for the polygon
      const deleteButton = L.DomUtil.create('button', 'delete-button');
      deleteButton.innerHTML = 'Delete';
      deleteButton.addEventListener('click', () => {
        this.deletePolygon(layer, drawnItems); // Delete the polygon when the delete button is clicked
      });

      // Add the delete button to the polygon
      layer.bindPopup(deleteButton);

      drawnItems.addLayer(layer);
    });

    drawnItems.on('click', (event: any) => {});
  }
}

export interface CustomLayer extends L.Layer {
  properties: {
    [key: string]: any; // Define any properties you want to add to the layer
  };
}
