import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  @Input() currentPage: number = 0;
  @Input() totalPages: number = this.currentPage;
  @Input() size: string = '1rem';
  @Output() pageChange = new EventEmitter<number>();

  prevPage(){
    if(this.canGetPreviousPage()){
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if(this.canGetNextPage()){
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  canGetNextPage(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  canGetPreviousPage(): boolean {
    return this.currentPage > 0;
  }

}
