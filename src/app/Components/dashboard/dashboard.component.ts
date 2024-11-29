import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  posts: PostDTO[] = [];
  totalLikes: number = 0;
  totalDislikes: number = 0;

  // Opciones del gráfico
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Oculta la leyenda en gráficos individuales
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Reactions',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.calculateTotals();
      },
      error: (error) => console.error('Error loading posts:', error),
    });
  }

  private calculateTotals(): void {
    this.totalLikes = this.posts.reduce((sum, post) => sum + post.num_likes, 0);
    this.totalDislikes = this.posts.reduce((sum, post) => sum + post.num_dislikes, 0);
  }

  // Genera datos para el gráfico de cada post
  generateChartData(post: PostDTO): ChartData<'bar'> {
    return {
      labels: ['Likes', 'Dislikes'],
      datasets: [
        { data: [post.num_likes, post.num_dislikes], backgroundColor: ['#17BF63', '#E0245E'] },
      ],
    };
  }
}
