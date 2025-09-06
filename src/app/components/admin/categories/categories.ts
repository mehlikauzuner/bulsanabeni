import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryDto } from '../../../models/category-model';
import { AdminCategoriesService } from '../../../services/category-service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class AdminCategories implements OnInit {
  rows: CategoryDto[] = [];
  loading = false;
  error = '';
  info = '';

  constructor(private api: AdminCategoriesService) {}

 ngOnInit(): void { this.fetch(); }

  fetch() {
    this.loading = true; this.error = ''; this.info = '';
    this.api.list().subscribe({
      next: (res) => { this.rows = res; this.loading = false; },
      error: (err) => { console.error('LIST_ERR', err); this.error = 'Liste alınamadı.'; this.loading = false; }
    });
  }

  addCategory() {
    const name = (prompt('CategoryName (zorunlu)?') ?? '').trim();
    if (!name) return;
    this.info = ''; this.error = '';
    this.api.add({ categoryName: name }).subscribe({
      next: () => { this.info = 'Kategori eklendi.'; this.fetch(); },
      error: (err) => { console.error('ADD_ERR', err); this.error = 'Ekleme başarısız.'; }
    });
  }

 editCategory(row: { id: number; categoryName: string }) {
  const name = (prompt('CategoryName', row.categoryName) ?? '').trim();
  if (!name) return;
  this.api.update(row.id, { categoryName: name }).subscribe({
    next: () => { this.info = 'Kategori güncellendi.'; this.fetch(); },
    error: err => { console.error('UPD_ERR', err); this.error = 'Güncelleme başarısız.'; }
  });
}


  deleteCategory(c: CategoryDto) {
    if (!confirm(`#${c.id} - "${c.categoryName}" silinsin mi?`)) return;
    this.info = ''; this.error = '';
    this.api.delete(c.id).subscribe({
      next: () => { this.info = 'Kategori silindi.'; this.fetch(); },
      error: (err) => { console.error('DEL_ERR', err); this.error = 'Silme başarısız.'; }
    });
  }
}