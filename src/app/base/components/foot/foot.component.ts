import { Component } from '@angular/core';
import pj from 'package.json';

@Component({
    selector: 'wfvs-foot',
    templateUrl: './foot.component.html',
    styleUrls: ['./foot.component.scss'],
    standalone: true
})
export class FootComponent {

  name = pj.name;
  version = pj.version;
  home = 'https://github.com/wilhelmfrank/wf_pure#readme';
  author = 'wilhelmina frank von stein';
  angular_uri = 'https://angular.io';
  node_uri = 'https://nodejs.org';
  bootstrap_uri = 'https://getbootstrap.com';

}
