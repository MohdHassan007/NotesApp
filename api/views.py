from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from .models import Note 
from .serializers import NoteSerializer
from rest_framework.permissions import IsAuthenticated
# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/notes/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of notes'
        },
        {
            'Endpoint': '/notes/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/notes/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Creates new note with data sent in post request'
        },
        {
            'Endpoint': '/notes/id/update/',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Creates an existing note with data sent in post request'
        },
        {
            'Endpoint': '/notes/id/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes and exiting note'
        },
    ]
     
    return Response(routes)

@api_view(['GET'])
def getNotes(request):
    notes=Note.objects.all().order_by('-updated')
    serializer=NoteSerializer(notes,many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNote(request,pk):
    notes=Note.objects.get(id=pk)
    serializer=NoteSerializer(notes,many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateNote(request, pk):
    try:
        note = Note.objects.get(id=pk)
    except Note.DoesNotExist:
        return Response({'error': 'Note not found'}, status=404)

    serializer = NoteSerializer(instance=note, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteNote(request,pk):
    note=Note.objects.get(id=pk)
    note.delete()
    return Response("Note was Deleted")


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createNote(request) :
    data=request.data
    note=Note.objects.create(
        body=data['body']
    )
    serializer =NoteSerializer(instance=note, data=request.data,many=False)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)  # Return the serialized data of the newly created note with a 201 status code
    else:
        return Response(serializer.errors, status=400) 
    
    return Response()