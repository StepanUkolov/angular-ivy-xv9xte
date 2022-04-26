import { Component, OnInit } from '@angular/core';
import { GeneralSettingClient, GeneralSettingDTO } from '../../web-api-client';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {
  name: string
  constructor(private general: GeneralSettingClient) { }

  ngOnInit(): void {
    this.general.get().subscribe((res: GeneralSettingDTO) => {
      this.name = res.siteName;
    })
  }

}
