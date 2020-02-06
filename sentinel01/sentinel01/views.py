from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'index.html')

def main(request):
    return render(request, 'main/main.html')

def lock(request):
    return render(request, 'main/lock.html')