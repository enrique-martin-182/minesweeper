// src/app/app.component.ts
import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(BoardComponent) board!: BoardComponent;

  timer = 0;              // segundos transcurridos
  timerInterval!: any;
  isRunning = false;
  gameOver = false;

  onFirstClick() {
    if (!this.isRunning && !this.gameOver) {
      this.isRunning = true;
      this.timer = 0;
      this.timerInterval = setInterval(() => this.timer++, 1000);
    }
  }

  onGameOver() {
    this.gameOver = true;
    this.isRunning = false;
    clearInterval(this.timerInterval);
  }

  newGame() {
    this.gameOver = false;
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.board.resetBoard();
  }
}
