// src/app/board/board.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface CellData {
  isMine: boolean;
  isRevealed: boolean;
  aroundMines: number;
  isFlagged: boolean;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() isBlocked = false;
  @Output() firstClick = new EventEmitter<void>();
  @Output() hitMine = new EventEmitter<void>();

  rows = 10;
  cols = 10;
  mines = 15;
  grid: CellData[][] = [];
  private hasStarted = false;

  ngOnInit() {
    this.initBoard();
  }

  initBoard() {
    // Igual que antes: genera tablero con minas y conteos
    const board: CellData[][] = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({
        isMine: false,
        isRevealed: false,
        aroundMines: 0,
        isFlagged: false
      }))
    );

    let planted = 0;
    while (planted < this.mines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (!board[r][c].isMine) {
        board[r][c].isMine = true;
        planted++;
      }
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!board[r][c].isMine) {
          let count = 0;
          for (let dr of [-1, 0, 1]) {
            for (let dc of [-1, 0, 1]) {
              const nr = r + dr, nc = c + dc;
              if (
                nr >= 0 && nr < this.rows &&
                nc >= 0 && nc < this.cols &&
                board[nr][nc].isMine
              ) count++;
            }
          }
          board[r][c].aroundMines = count;
        }
      }
    }

    this.grid = board;
    this.hasStarted = false;
  }

  resetBoard() {
    this.initBoard();
  }

  revealCell(r: number, c: number) {
    if (this.isBlocked) return;
    const cell = this.grid[r][c];
    if (!this.hasStarted) {
      this.hasStarted = true;
      this.firstClick.emit();
    }
    if (cell.isRevealed || cell.isFlagged) return;
    cell.isRevealed = true;
    if (cell.isMine) {
      // el jugador pierde
      this.revealAllMines();
      this.hitMine.emit();
      return;
    }
    if (cell.aroundMines === 0) {
      for (let dr of [-1, 0, 1]) {
        for (let dc of [-1, 0, 1]) {
          const nr = r + dr, nc = c + dc;
          if (
            nr >= 0 && nr < this.rows &&
            nc >= 0 && nc < this.cols
          ) {
            this.revealCell(nr, nc);
          }
        }
      }
    }
  }

  toggleFlag(r: number, c: number) {
    if (this.isBlocked) return;
    const cell = this.grid[r][c];
    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
    }
  }

  private revealAllMines() {
    for (let row of this.grid) {
      for (let cell of row) {
        if (cell.isMine) cell.isRevealed = true;
      }
    }
  }
}

