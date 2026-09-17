from rest_framework import serializers
from .models import Meeting


class MeetingSerializer(serializers.ModelSerializer):
    organizer_name = serializers.SerializerMethodField()
    participants_names = serializers.SerializerMethodField()
    participants_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Meeting
        fields = ['id', 'title', 'description', 'date', 'time', 'duration', 'location',
                  'status', 'organizer', 'organizer_name', 'participants', 'participants_names',
                  'participants_count', 'agenda', 'protocol', 'created_at', 'updated_at']
        read_only_fields = ['id', 'organizer', 'created_at', 'updated_at']
    
    def get_organizer_name(self, obj):
        return obj.organizer.get_full_name() or obj.organizer.username
    
    def get_participants_names(self, obj):
        return [p.get_full_name() or p.username for p in obj.participants.all()]
    
    def get_participants_count(self, obj):
        return obj.participants.count()
