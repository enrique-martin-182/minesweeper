import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {
  @Input() data!: {
    isMine: boolean;
    isRevealed: boolean;
    aroundMines: number;
    isFlagged: boolean;
  };
  @Output() clickCell = new EventEmitter<void>();
  @Output() flagCell = new EventEmitter<void>();

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.flagCell.emit();
  }
}

