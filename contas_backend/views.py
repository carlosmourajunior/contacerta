from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ContaRecorrente, ContaParcelada, ContaUnica
from .serializers import ContaRecorrenteSerializer, ContaParceladaSerializer, ContaUnicaSerializer

class ContaRecorrenteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ContaRecorrenteSerializer

    def get_queryset(self):
        return ContaRecorrente.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ContaParceladaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ContaParceladaSerializer

    def get_queryset(self):
        return ContaParcelada.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ContaUnicaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ContaUnicaSerializer

    def get_queryset(self):
        return ContaUnica.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)