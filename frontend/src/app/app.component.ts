import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, AvatarModule],
  template: `
    <p-toast position="top-right"></p-toast>

    <div class="app-frame">
      <div class="app-window">
        <header class="topbar">
          <div class="brand-mark">
  <img src="/images/logo.png" alt="Grupo Embras" class="brand-logo" />
</div>

          <p-avatar label="DA" shape="circle"></p-avatar>
        </header>

        <main class="page-container">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppComponent {}