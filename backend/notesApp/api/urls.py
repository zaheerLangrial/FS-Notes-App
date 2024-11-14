from django.urls import path
from .views import NoteCreateView, NoteDeleteView


urlpatterns = [
    path('notes/', NoteCreateView.as_view(), name='note-list'),
    path('notes/delete/<int:id>', NoteDeleteView.as_view(), name='delete-note')
]