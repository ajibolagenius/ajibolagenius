from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid


def generate_id():
    return str(uuid.uuid4())[:8]


# ---- Personal Info ----
class SocialLinks(BaseModel):
    github: str = ""
    twitter: str = ""
    linkedin: str = ""
    whatsapp: str = ""


class PersonalInfo(BaseModel):
    name: str
    tagline: str
    tagline_suffix: str
    description: str
    role: str
    email: str
    location: str
    availability: str
    social: SocialLinks


# ---- Projects ----
class TechDetail(BaseModel):
    name: str
    role: str


class Project(BaseModel):
    id: str = Field(default_factory=generate_id)
    slug: str
    name: str
    category: str
    label: str
    description: str
    tags: List[str] = []
    type: str = "dev"
    featured: bool = False
    live_url: str = "#"
    github_url: str = "#"
    problem: str = ""
    solution: str = ""
    role_title: str = ""
    duration: str = ""
    year: str = ""
    tech_details: List[TechDetail] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ProjectCreate(BaseModel):
    slug: str
    name: str
    category: str
    label: str
    description: str
    tags: List[str] = []
    type: str = "dev"
    featured: bool = False
    live_url: str = "#"
    github_url: str = "#"
    problem: str = ""
    solution: str = ""
    role_title: str = ""
    duration: str = ""
    year: str = ""
    tech_details: List[TechDetail] = []


# ---- Courses ----
class Course(BaseModel):
    id: str = Field(default_factory=generate_id)
    slug: str
    name: str
    duration: str
    price: str
    badge: str
    description: str
    curriculum: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CourseCreate(BaseModel):
    slug: str
    name: str
    duration: str
    price: str
    badge: str
    description: str
    curriculum: List[str] = []


# ---- Blog Posts ----
class BlogPost(BaseModel):
    id: str = Field(default_factory=generate_id)
    slug: str
    title: str
    date: str
    tags: List[str] = []
    category: str = ""
    excerpt: str = ""
    body: str = ""
    read_time: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)


class BlogPostCreate(BaseModel):
    slug: str
    title: str
    date: str
    tags: List[str] = []
    category: str = ""
    excerpt: str = ""
    body: str = ""
    read_time: str = ""


# ---- Gallery ----
class GalleryItem(BaseModel):
    id: str = Field(default_factory=generate_id)
    title: str
    type: str
    color: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class GalleryItemCreate(BaseModel):
    title: str
    type: str
    color: str


# ---- Timeline ----
class TimelineEntry(BaseModel):
    id: str = Field(default_factory=generate_id)
    year: str
    title: str
    body: str
    accent: str = "sungold"
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TimelineEntryCreate(BaseModel):
    year: str
    title: str
    body: str
    accent: str = "sungold"
    order: int = 0


# ---- Testimonials ----
class Testimonial(BaseModel):
    id: str = Field(default_factory=generate_id)
    name: str
    role: str
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TestimonialCreate(BaseModel):
    name: str
    role: str
    text: str


# ---- Contact Messages ----
class ContactMessage(BaseModel):
    id: str = Field(default_factory=generate_id)
    name: str
    email: str
    subject: str = ""
    message: str
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ContactMessageCreate(BaseModel):
    name: str
    email: str
    subject: str = ""
    message: str


# ---- Newsletter ----
class NewsletterSubscriber(BaseModel):
    id: str = Field(default_factory=generate_id)
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class NewsletterSubscribe(BaseModel):
    email: str
