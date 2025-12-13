from django.urls import reverse_lazy, reverse
from django.views.generic.edit import CreateView
from .forms import CustomUserCreationForm
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.http import HttpResponseRedirect

class SignUpView(CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'registration/signup.html'

@login_required
def profile(request):
    return render(request, 'registration/profile.html', {'user': request.user})

def custom_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('home'))
