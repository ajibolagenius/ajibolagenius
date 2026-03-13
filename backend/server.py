from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError
import os
import logging
from pathlib import Path
from datetime import datetime

from models import (
    PersonalInfo, Project, ProjectCreate, Course, CourseCreate,
    BlogPost, BlogPostCreate, GalleryItem, GalleryItemCreate,
    TimelineEntry, TimelineEntryCreate, Testimonial, TestimonialCreate,
    ContactMessage, ContactMessageCreate, NewsletterSubscriber, NewsletterSubscribe,
    generate_id
)
from seed_data import (
    PERSONAL_INFO, PROJECTS, COURSES, BLOG_POSTS,
    GALLERY_ITEMS, TIMELINE_ENTRIES, TESTIMONIALS
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
if not mongo_url:
    raise RuntimeError(
        "MONGO_URL is not set. Create backend/.env with MONGO_URL=mongodb://localhost:27017 (or your MongoDB connection string)."
    )
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'portfolio')]

# Create the main app
app = FastAPI(title="AjibolaAkelebe Portfolio API")

# Create routers
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ========================================
# SEED ENDPOINT
# ========================================

@api_router.post("/seed")
async def seed_database():
    """Seed DB with initial data if collections are empty."""
    results = {}

    # Personal Info
    if await db.personal_info.count_documents({}) == 0:
        await db.personal_info.insert_one(PERSONAL_INFO)
        results["personal_info"] = "seeded"
    else:
        results["personal_info"] = "exists"

    # Projects
    if await db.projects.count_documents({}) == 0:
        for p in PROJECTS:
            doc = {**p, "id": generate_id(), "created_at": datetime.utcnow()}
            await db.projects.insert_one(doc)
        results["projects"] = f"seeded {len(PROJECTS)}"
    else:
        results["projects"] = "exists"

    # Courses
    if await db.courses.count_documents({}) == 0:
        for c in COURSES:
            doc = {**c, "id": generate_id(), "created_at": datetime.utcnow()}
            await db.courses.insert_one(doc)
        results["courses"] = f"seeded {len(COURSES)}"
    else:
        results["courses"] = "exists"

    # Blog Posts
    if await db.blog_posts.count_documents({}) == 0:
        for bp in BLOG_POSTS:
            doc = {**bp, "id": generate_id(), "created_at": datetime.utcnow()}
            await db.blog_posts.insert_one(doc)
        results["blog_posts"] = f"seeded {len(BLOG_POSTS)}"
    else:
        results["blog_posts"] = "exists"

    # Gallery
    if await db.gallery_items.count_documents({}) == 0:
        for g in GALLERY_ITEMS:
            doc = {**g, "id": generate_id(), "created_at": datetime.utcnow()}
            await db.gallery_items.insert_one(doc)
        results["gallery_items"] = f"seeded {len(GALLERY_ITEMS)}"
    else:
        results["gallery_items"] = "exists"

    # Timeline
    if await db.timeline_entries.count_documents({}) == 0:
        for t in TIMELINE_ENTRIES:
            doc = {**t, "id": generate_id(), "created_at": datetime.utcnow()}
            await db.timeline_entries.insert_one(doc)
        results["timeline_entries"] = f"seeded {len(TIMELINE_ENTRIES)}"
    else:
        results["timeline_entries"] = "exists"

    # Testimonials
    if await db.testimonials.count_documents({}) == 0:
        for t in TESTIMONIALS:
            doc = {**t, "id": generate_id(), "created_at": datetime.utcnow()}
            await db.testimonials.insert_one(doc)
        results["testimonials"] = f"seeded {len(TESTIMONIALS)}"
    else:
        results["testimonials"] = "exists"

    return {"status": "ok", "results": results}


# ========================================
# PUBLIC ENDPOINTS
# ========================================

@api_router.get("/")
async def root():
    return {"message": "AjibolaAkelebe Portfolio API v1.0"}


@api_router.get("/personal-info")
async def get_personal_info():
    doc = await db.personal_info.find_one({}, {"_id": 0})
    if not doc:
        return PERSONAL_INFO
    return doc


@api_router.get("/projects")
async def get_projects():
    docs = await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    if not docs:
        return PROJECTS
    return docs


@api_router.get("/projects/{slug}")
async def get_project(slug: str):
    doc = await db.projects.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        # Fallback to seed data
        for p in PROJECTS:
            if p["slug"] == slug:
                return p
        raise HTTPException(status_code=404, detail="Project not found")
    return doc


@api_router.get("/courses")
async def get_courses():
    docs = await db.courses.find({}, {"_id": 0}).to_list(100)
    if not docs:
        return COURSES
    return docs


@api_router.get("/blog-posts")
async def get_blog_posts():
    docs = await db.blog_posts.find({}, {"_id": 0}).sort("date", -1).to_list(100)
    if not docs:
        return BLOG_POSTS
    return docs


@api_router.get("/blog-posts/{slug}")
async def get_blog_post(slug: str):
    doc = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        for bp in BLOG_POSTS:
            if bp["slug"] == slug:
                return bp
        raise HTTPException(status_code=404, detail="Post not found")
    return doc


@api_router.get("/gallery")
async def get_gallery():
    docs = await db.gallery_items.find({}, {"_id": 0}).to_list(100)
    if not docs:
        return GALLERY_ITEMS
    return docs


@api_router.get("/timeline")
async def get_timeline():
    docs = await db.timeline_entries.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    if not docs:
        return TIMELINE_ENTRIES
    return docs


@api_router.get("/testimonials")
async def get_testimonials():
    docs = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    if not docs:
        return TESTIMONIALS
    return docs


# ---- Contact Form ----
@api_router.post("/contact")
async def submit_contact(data: ContactMessageCreate):
    msg = ContactMessage(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message
    )
    await db.contact_messages.insert_one(msg.dict())
    return {"status": "ok", "message": "Message received! I'll get back to you soon."}


# ---- Newsletter ----
@api_router.post("/newsletter")
async def subscribe_newsletter(data: NewsletterSubscribe):
    existing = await db.newsletter_subscribers.find_one({"email": data.email})
    if existing:
        return {"status": "ok", "message": "You're already subscribed!"}
    sub = NewsletterSubscriber(email=data.email)
    await db.newsletter_subscribers.insert_one(sub.dict())
    return {"status": "ok", "message": "Subscribed! You'll hear from me soon."}


# ========================================
# ADMIN ENDPOINTS
# ========================================

# ---- Projects CRUD ----
@api_router.post("/admin/projects")
async def create_project(data: ProjectCreate):
    project = Project(**data.dict())
    await db.projects.insert_one(project.dict())
    return project.dict()


@api_router.put("/admin/projects/{project_id}")
async def update_project(project_id: str, data: ProjectCreate):
    result = await db.projects.update_one(
        {"id": project_id},
        {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "ok", "id": project_id}


@api_router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: str):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "ok"}


# ---- Courses CRUD ----
@api_router.post("/admin/courses")
async def create_course(data: CourseCreate):
    course = Course(**data.dict())
    await db.courses.insert_one(course.dict())
    return course.dict()


@api_router.put("/admin/courses/{course_id}")
async def update_course(course_id: str, data: CourseCreate):
    result = await db.courses.update_one(
        {"id": course_id},
        {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"status": "ok", "id": course_id}


@api_router.delete("/admin/courses/{course_id}")
async def delete_course(course_id: str):
    result = await db.courses.delete_one({"id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"status": "ok"}


# ---- Blog Posts CRUD ----
@api_router.post("/admin/blog-posts")
async def create_blog_post(data: BlogPostCreate):
    post = BlogPost(**data.dict())
    await db.blog_posts.insert_one(post.dict())
    return post.dict()


@api_router.put("/admin/blog-posts/{post_id}")
async def update_blog_post(post_id: str, data: BlogPostCreate):
    result = await db.blog_posts.update_one(
        {"id": post_id},
        {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"status": "ok", "id": post_id}


@api_router.delete("/admin/blog-posts/{post_id}")
async def delete_blog_post(post_id: str):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"status": "ok"}


# ---- Gallery CRUD ----
@api_router.post("/admin/gallery")
async def create_gallery_item(data: GalleryItemCreate):
    item = GalleryItem(**data.dict())
    await db.gallery_items.insert_one(item.dict())
    return item.dict()


@api_router.put("/admin/gallery/{item_id}")
async def update_gallery_item(item_id: str, data: GalleryItemCreate):
    result = await db.gallery_items.update_one(
        {"id": item_id},
        {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"status": "ok", "id": item_id}


@api_router.delete("/admin/gallery/{item_id}")
async def delete_gallery_item(item_id: str):
    result = await db.gallery_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"status": "ok"}


# ---- Timeline CRUD ----
@api_router.post("/admin/timeline")
async def create_timeline_entry(data: TimelineEntryCreate):
    entry = TimelineEntry(**data.dict())
    await db.timeline_entries.insert_one(entry.dict())
    return entry.dict()


@api_router.put("/admin/timeline/{entry_id}")
async def update_timeline_entry(entry_id: str, data: TimelineEntryCreate):
    result = await db.timeline_entries.update_one(
        {"id": entry_id},
        {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Timeline entry not found")
    return {"status": "ok", "id": entry_id}


@api_router.delete("/admin/timeline/{entry_id}")
async def delete_timeline_entry(entry_id: str):
    result = await db.timeline_entries.delete_one({"id": entry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Timeline entry not found")
    return {"status": "ok"}


# ---- Testimonials CRUD ----
@api_router.post("/admin/testimonials")
async def create_testimonial(data: TestimonialCreate):
    testimonial = Testimonial(**data.dict())
    await db.testimonials.insert_one(testimonial.dict())
    return testimonial.dict()


@api_router.put("/admin/testimonials/{testimonial_id}")
async def update_testimonial(testimonial_id: str, data: TestimonialCreate):
    result = await db.testimonials.update_one(
        {"id": testimonial_id},
        {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"status": "ok", "id": testimonial_id}


@api_router.delete("/admin/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"status": "ok"}


# ---- Admin: Personal Info ----
@api_router.put("/admin/personal-info")
async def update_personal_info(data: PersonalInfo):
    await db.personal_info.update_one({}, {"$set": data.dict()}, upsert=True)
    return {"status": "ok"}


# ---- Admin: Read submissions ----
@api_router.get("/admin/contact-messages")
async def get_contact_messages():
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.get("/admin/newsletter-subscribers")
async def get_newsletter_subscribers():
    docs = await db.newsletter_subscribers.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


# ========================================
# APP SETUP
# ========================================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    logger.info("Portfolio API starting up...")
    try:
        count = await db.projects.count_documents({})
        if count == 0:
            logger.info("Database empty — auto-seeding...")
            await db.personal_info.insert_one(PERSONAL_INFO)
            for p in PROJECTS:
                await db.projects.insert_one({**p, "id": generate_id(), "created_at": datetime.utcnow()})
            for c in COURSES:
                await db.courses.insert_one({**c, "id": generate_id(), "created_at": datetime.utcnow()})
            for bp in BLOG_POSTS:
                await db.blog_posts.insert_one({**bp, "id": generate_id(), "created_at": datetime.utcnow()})
            for g in GALLERY_ITEMS:
                await db.gallery_items.insert_one({**g, "id": generate_id(), "created_at": datetime.utcnow()})
            for t in TIMELINE_ENTRIES:
                await db.timeline_entries.insert_one({**t, "id": generate_id(), "created_at": datetime.utcnow()})
            for t in TESTIMONIALS:
                await db.testimonials.insert_one({**t, "id": generate_id(), "created_at": datetime.utcnow()})
            logger.info("Auto-seed complete!")
        else:
            logger.info(f"Database has {count} projects — skipping seed.")
    except ServerSelectionTimeoutError:
        logger.warning(
            "MongoDB not reachable (connection refused). Start MongoDB or set MONGO_URL. "
            "API will start but DB-dependent routes will fail until connected."
        )


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
