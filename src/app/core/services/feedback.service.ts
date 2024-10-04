import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notifications/notification.service';
import { Observable } from 'rxjs';
import { IFeedback } from '../model/common.model';
import { ApiEndpoint } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(
    private _http: HttpClient,
    private notificationService: NotificationService
  ) {}
  getAllFeedback(): Observable<{ success: boolean; data: IFeedback[] }> {
    return this._http.get<{ success: boolean; data: IFeedback[] }>(
      `${ApiEndpoint.Feedback.GetAllFeedback}`
    );
  }
  addFeedback(
    feedback: IFeedback
  ): Observable<{ success: boolean; data: IFeedback }> {
    return this._http.post<{ success: boolean; data: IFeedback }>(
      `${ApiEndpoint.Feedback.AddFeedBack}`,
      feedback
    );
  }
  deleteFeedback(
    id: string
  ): Observable<{ success: boolean; message: string }> {
    return this._http.delete<{ success: boolean; message: string }>(
      `${ApiEndpoint.Feedback.DeleteFeedback}?id=${id}`
    );
  }
  updateFeedbackStatus(
    id: string,
    status: string
  ): Observable<{ success: boolean; message: string; data: IFeedback }> {
    return this._http.put<{
      success: boolean;
      message: string;
      data: IFeedback;
    }>(`${ApiEndpoint.Feedback.UpdateFeedbackStatus}?feedbackId=${id}`, {
      status,
    });
  }
  searchFeedback(
    searchTerm: string
  ): Observable<{ success: boolean; message: string; data: IFeedback[] }> {
    return this._http.get<{
      success: boolean;
      message: string;
      data: IFeedback[];
    }>(`${ApiEndpoint.Feedback.SearchFeedback}?name=${searchTerm}`);
  }
}
