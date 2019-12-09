import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IExternalData } from '../models/generated/external-data';
import { filter, tap } from 'rxjs/operators';
// @ts-ignore
import Ajv = require('ajv');


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly schemaName = 'ExternalData';
  private data: IExternalData;
  private validator: Ajv.Ajv;

  constructor(private http: HttpClient) {
    const schema = {}; // not sure how I would load/import my JSON-schema from src/assets/schemas
    this.validator = new Ajv({allErrors: true});
    this.validator.addSchema(schema);
  }

  async loadData() {
    try {
      const result = await this.http.get<IExternalData>('http://example.org/api/GetData')
      .pipe(
        tap( response => {console.log('resp: ', response)}),
        filter( response => !!this.validator.validate(this.schemaName, response)) // not sure if this is a good approach
      ).toPromise();
      this.data = result;
      console.log('Successfully loaded data: ', this.data);
    } catch (error) {
      console.log('Unable to get data: ', error);
    }
  }

  get isLoaded(): boolean {
    return !!this.data;
  }

  get someString(): string {
    return this.data.someString;
  }

  get someNumber(): number {
    return this.data.someNumber;
  }
}
