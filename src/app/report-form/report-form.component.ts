import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../_services/post/post.service';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.css'
})
export class ReportFormComponent {
  @Input() showReportForm: boolean = false;
  @Input() postId!: number;
  @Input() commmentId?: number;
  @Output() reportFormClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() reportSended: EventEmitter<void> = new EventEmitter<void>();
  reportForm = this.fb.group({
    cause: ['', [Validators.required, Validators.maxLength(200)]]
  })
  errorResponse:string = "";

  constructor(private fb:FormBuilder, private postService:PostService) {}

  closeReportForm() {
    this.reportForm.reset();
    this.showReportForm = false;
    this.reportFormClosed.emit();
  }

  addCommonCause(commonCause: string) {
    this.reportForm.patchValue({cause: commonCause});
  }

  onSubmit(){
    if(!this.commmentId) this.sendPostReport();
    else {
      this.sendCommentReport();
    }
  }

  sendPostReport(){
    const {cause} = this.reportForm.value;
    if(cause) {
      this.postService.reportPost(cause, this.postId).subscribe({
        next:() => this.closeReportForm(),
        error:(error) => this.errorResponse = error
      })
    }
  }

  sendCommentReport(){
    const {cause} = this.reportForm.value;
    if(cause && this.commmentId) {
      this.postService.reportComment(cause, this.commmentId).subscribe({
        next:() => this.closeReportForm(),
        error:(error) => this.errorResponse = error
      })
    }
  }

}
