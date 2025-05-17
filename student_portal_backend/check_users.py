from core.models import CustomUser; print(list(CustomUser.objects.all().values('username', 'role'))) 
