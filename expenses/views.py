from django.shortcuts import render
from rest_framework import viewsets, status, authentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.exceptions import ObjectDoesNotExist
from .models import Expense, Category, Income
from .serializers import ExpenseSerializer, CategorySerializer, IncomeSerializer
import logging

logger = logging.getLogger(__name__)

class CategoryViewSet(viewsets.ModelViewSet):
    authentication_classes = [authentication.BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer

    def get_queryset(self):
        logger.info(f"User {self.request.user} requesting categories")
        return Category.objects.all()

    def list(self, request, *args, **kwargs):
        try:
            logger.info(f"Auth attempt for categories - User: {request.user}, Auth: {request.auth}")
            
            if not request.user.is_authenticated:
                logger.warning("User is not authenticated")
                return Response(
                    {"error": "Authentication required"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f"Successfully returning {len(serializer.data)} categories")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in categories list view: {str(e)}", exc_info=True)
            return Response(
                {"error": "Error fetching categories"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ExpenseViewSet(viewsets.ModelViewSet):
    authentication_classes = [authentication.BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        logger.info(f"User {self.request.user} requesting expenses")
        return Expense.objects.filter(user=self.request.user).order_by('-date')

    def list(self, request, *args, **kwargs):
        try:
            logger.info(f"Auth attempt for expenses - User: {request.user}, Auth: {request.auth}")
            
            if not request.user.is_authenticated:
                logger.warning("User is not authenticated")
                return Response(
                    {"error": "Authentication required"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f"Successfully returning {len(serializer.data)} expenses")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in expenses list view: {str(e)}", exc_info=True)
            return Response(
                {"error": "Error fetching expenses"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        logger.info(f"Creating expense for user {self.request.user}")
        serializer.save(user=self.request.user)

class IncomeViewSet(viewsets.ModelViewSet):
    authentication_classes = [authentication.BasicAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = IncomeSerializer

    def get_queryset(self):
        logger.info(f"User {self.request.user} requesting incomes")
        return Income.objects.filter(user=self.request.user).order_by('-date')

    def list(self, request, *args, **kwargs):
        try:
            logger.info(f"Auth attempt for incomes - User: {request.user}, Auth: {request.auth}")
            
            if not request.user.is_authenticated:
                logger.warning("User is not authenticated")
                return Response(
                    {"error": "Authentication required"}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f"Successfully returning {len(serializer.data)} incomes")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in incomes list view: {str(e)}", exc_info=True)
            return Response(
                {"error": "Error fetching incomes"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        logger.info(f"Creating income for user {self.request.user}")
        serializer.save(user=self.request.user)
