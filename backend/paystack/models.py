# from django.db import models
# from django.conf import settings
# # Create your models here.
# class Payment(models.Model):
#     user = models.OneToOneField(settings.AUTO_USER_MODEL, on_delete=models.SET_NULL, blank=False, null=False)
#     amount = models.IntegerField(required=True, blank=False, null=False)
#     account_number = models.IntegerField(required=True, blank=False, null=False)
#     sent_date = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         ordering = ['sent_date']
        