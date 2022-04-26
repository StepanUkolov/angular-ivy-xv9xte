import { Component, OnInit } from '@angular/core';
import { GeneralSettingClient, GeneralSettingDTO } from '../../web-api-client';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  name: string
  constructor(private general: GeneralSettingClient) { }

  ngOnInit(): void {
    this.general.get().subscribe((res: GeneralSettingDTO) => {
      this.name = res.siteName;
    })
  }
}
