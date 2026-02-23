import { computed, Injectable, signal } from '@angular/core';
import { RequestItem } from '../model/request';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private cache = new Map<string, any>();
  requestUrl = 'https://699ae875377ac05ce28efbc4.mockapi.io/requests';

  allRequests = signal<RequestItem[]>([]);

  completate = computed(() => this.allRequests().filter(r => r.status === 'completate'));
  inLavorazione = computed(() => this.allRequests().filter(r => r.status === 'in_lavorazione'));
  daFare = computed(() => this.allRequests().filter(r => r.status === 'da_fare'));

  private getSavedStatus(id: string): string {
    return localStorage.getItem(`status_${id}`) ?? 'da_fare';
  }

  getRequest(): Promise<RequestItem[]> {
    return fetch(this.requestUrl)
      .then(resp => resp.json())
      .then(requests => {
        const mapped = requests.map((r: RequestItem) => ({
          ...r,
          status: this.getSavedStatus(r.id)  // ← sobreescribe status con localStorage
        }));
        this.allRequests.set(mapped);
        return mapped;
      });
  }

  getRequestById(id: string): Promise<RequestItem> {
    if (this.cache.has(id)) {
      return Promise.resolve(this.cache.get(id));
    }
    return fetch(`${this.requestUrl}/${id}`)
      .then(resp => resp.json())
      .then(request => {
        const withStatus = { ...request, status: this.getSavedStatus(id) };
        this.cache.set(id, withStatus);
        return withStatus;
      });
  }

  updateStatus(id: string, status: string): void {
    localStorage.setItem(`status_${id}`, status);
    this.allRequests.update(list =>
      list.map(r => r.id === id ? { ...r, status } : r)
    );
    // actualiza cache también
    if (this.cache.has(id)) {
      this.cache.set(id, { ...this.cache.get(id), status });
    }
  }

  createRequest(data: Partial<RequestItem>): Promise<RequestItem> {
    return fetch(this.requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(newRequest => {
      const withStatus = { ...newRequest, status: data.status ?? 'da_fare' };
      localStorage.setItem(`status_${newRequest.id}`, withStatus.status);
      this.allRequests.update(list => [...list, withStatus]);
      return withStatus;
    });
  }

  updateRequest(id: string, data: Partial<RequestItem>): Promise<RequestItem> {
    return fetch(`${this.requestUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(updated => {
      const withStatus = { ...updated, status: data.status ?? this.getSavedStatus(id) };
      localStorage.setItem(`status_${id}`, withStatus.status);
      this.allRequests.update(list => list.map(r => r.id === id ? withStatus : r));
      this.cache.set(id, withStatus);
      return withStatus;
    });
  }

  deleteRequest(id: string): Promise<void> {
    return fetch(`${this.requestUrl}/${id}`, { method: 'DELETE' })
      .then(() => {
        localStorage.removeItem(`status_${id}`);
        this.cache.delete(id);
        this.allRequests.update(list => list.filter(r => r.id !== id));
      });
  }
}
