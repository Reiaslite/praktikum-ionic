import { Component, OnInit } from '@angular/core';
// import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { LocationService } from '../services/location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  readerMode$: any;

  constructor(
    // private nfc: NFC,
    // private ndef: Ndef,
    private route: Router,
    private geoLocationService: LocationService
  ) { }

  ngOnInit() {
    // this.getLocation();
  }

  async getLocation() {
    const positition = await this.geoLocationService.getLocation();
    const { latitude, longitude, accuracy } = positition.coords;

    // get address
    const getAddress = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const address = await getAddress.json();

    console.log(address);

    return address;
  }

  async sendEmail(){
    const address = await this.getLocation();
    const obj = {
      address: address.display_name
    }
    // const email = `mailto:raidearaujo@gmail.com?subject=Lokasi&body={{obj.address}}`
    const emailBody = encodeURIComponent(`Lokasi: ${obj.address}`);
    const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=Lokasi&body=${emailBody}`;

    //simpan ke histori local storage
    const history = localStorage.getItem('emailHistory');
    const emailHistory = history ? JSON.parse(history) :  [];
    emailHistory.push(emailUrl);
    localStorage.setItem('emailHistory', JSON.stringify(emailHistory));
    
    // window.open(emailUrl);
  }

  toHistory(){
    this.route.navigateByUrl('history')
  }
  
  // async cekNPC(){
  //   // Read NFC Tag - Android
  //   // Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
  //   let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
  //   this.readerMode$ = this.nfc.readerMode(flags).subscribe(
  //       tag => console.log(JSON.stringify(tag)),
  //       err => console.log('Error reading tag', err)
  //   );

  //   // Read NFC Tag - iOS
  //   // On iOS, a NFC reader session takes control from your app while scanning tags then returns a tag
  //   try {
  //       let tag = await this.nfc.scanNdef();
  //       console.log(JSON.stringify(tag));
  //   } catch (err) {
  //       console.log('Error reading tag', err);
  //   }
  // }

}
