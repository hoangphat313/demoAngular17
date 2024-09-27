import { Component, OnInit } from '@angular/core';
import { Post } from '../../core/model/common.model';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  postId: string = '';
  formattedContent: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}
  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') ?? '';
    this.postService.getPostById(this.postId).subscribe(
      (response) => {
        if (response.success && response.data) {
          console.log(response.data);
          this.post = response.data;
          if (this.post && this.post.content) {
            this.formattedContent = this.post.content
              .split('\n')
              .map((paragraph) => paragraph.trim());
            console.log(this.formattedContent);
          }
        }
      },
      (error) => console.log(error)
    );
  }
}
