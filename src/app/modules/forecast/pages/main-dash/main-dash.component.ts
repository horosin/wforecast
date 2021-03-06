import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { WeatherService } from '@app/core';
import { Forecast, Country } from '@app/shared';

@Component({
  selector: 'app-main-dash',
  templateUrl: './main-dash.component.html',
  styleUrls: ['./main-dash.component.css']
})
export class MainDashComponent implements OnInit {

  country: Country = {
    name: 'United Kingdom',
    alpha2: 'UK'
  };
  city = 'London';
  forecastData: Observable<Forecast[]>;
  meanPressure: any;
  meanHumidity: any;
  meanTemperature: any;
  doubleWidth = 2;
  tableVisible = false;
  errorMessage = false;

  cardsize = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        this.doubleWidth = 1;
        console.log('Big');
      }
      this.doubleWidth = 2;
      console.log('Big');
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private weatherService: WeatherService) {}

  ngOnInit() {
    this.update();
  }

  update() {
    this.tableVisible = false;
    this.errorMessage = false;
    this.forecastData = this.weatherService.getForecast(this.city, this.country.alpha2).pipe(map((x: any) => x.list));
    this.forecastData.subscribe(
      (data) => {
        this.calcMeanValues();
        this.tableVisible = true;
      },
      (error) => {
        this.errorMessage = true;
      }
    );
  }

  updateCity(event) {
    this.city = event.city;
    this.country = event.country;
    console.log(this.city, this.country);
    this.update();
  }

  calcMeanValues() {
    this.forecastData.subscribe(data => {
      this.meanPressure = data.reduce(
        (accumulator, val) => accumulator + val.main.pressure, 0) / data.length;
      this.meanHumidity = data.reduce(
        (accumulator, val) => accumulator + val.main.humidity, 0) / data.length;
      this.meanTemperature = data.reduce(
        (accumulator, val) => accumulator + val.main.temp, 0) / data.length;
      console.log(this.meanHumidity);
    });
  }
}
