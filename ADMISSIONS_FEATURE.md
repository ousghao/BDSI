# Admissions Feature Implementation

## Overview

The Admissions feature provides a complete application management system for the Master BDSI program, including:

- **Public Application Form**: Secure online application submission with PDF upload
- **Admin Management Interface**: Complete CRUD operations for managing applications
- **File Storage**: Secure PDF storage with Supabase Storage
- **Status Tracking**: Application lifecycle management (submitted → under_review → accepted/rejected)

## Database Schema

### Admissions Table

```sql
CREATE TABLE admissions (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    national_id VARCHAR NOT NULL,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    prior_degree VARCHAR NOT NULL, -- bac, licence, master, equivalent
    gpa_or_score VARCHAR,
    program_track VARCHAR,
    pdf_url VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'submitted', -- submitted, under_review, accepted, rejected
    notes_admin TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes

- `idx_admissions_email` - Email lookup
- `idx_admissions_national_id` - National ID lookup  
- `idx_admissions_created_at` - Date-based queries
- `idx_admissions_status` - Status filtering
- `idx_admissions_program_track` - Program track filtering

## API Endpoints

### Public Endpoints

#### POST `/api/admissions`
Submit a new application with PDF upload.

**Request:**
- `multipart/form-data` with form fields and PDF file
- Form fields: `fullName`, `email`, `phone`, `nationalId`, `dob`, `address`, `priorDegree`, `gpaOrScore`, `programTrack`
- File: `pdf` (PDF only, max 20MB)

**Response:**
```json
{
  "ok": true,
  "id": 123,
  "message": "Candidature soumise avec succès"
}
```

### Admin Endpoints (requireAdmin middleware)

#### GET `/api/admissions/admin`
Get paginated list of applications with filters.

**Query Parameters:**
- `status` - Filter by status
- `programTrack` - Filter by program track
- `search` - Search in name, email, national ID
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "ok": true,
  "data": {
    "admissions": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

#### GET `/api/admissions/admin/:id`
Get details of a specific application.

#### PATCH `/api/admissions/admin/:id`
Update application status and admin notes.

**Request Body:**
```json
{
  "status": "accepted",
  "notesAdmin": "Excellent profil, accepté"
}
```

#### GET `/api/admissions/admin/:id/pdf`
Get signed download URL for the application PDF.

## File Storage

### Supabase Storage Configuration

- **Bucket**: `documents`
- **Path Structure**: `admissions/{year}/{timestamp}-{filename}.pdf`
- **Security**: Signed URLs with 1-hour expiry for admin downloads
- **File Validation**: PDF only, max 20MB

### Storage Operations

1. **Upload**: Files uploaded to Supabase Storage during application submission
2. **Public URL**: Stored in database for reference
3. **Secure Download**: Admin downloads use signed URLs for security

## Frontend Components

### Public Application Form (`/admissions`)

- **Form Validation**: Client-side validation with Zod schema
- **File Upload**: PDF validation and preview
- **Success Flow**: Confirmation page with next steps
- **Responsive Design**: Mobile-friendly layout
- **i18n Support**: French, English, Arabic

### Admin Management Interface (`/admin/admissions`)

- **List View**: Table with pagination and filters
- **Detail View**: Modal with application details and actions
- **Status Management**: Quick status updates
- **PDF Download**: Secure file access
- **Notes System**: Administrative notes per application

## Security Features

### Authentication & Authorization

- **Public Form**: No authentication required
- **Admin Access**: `requireAdmin` middleware protection
- **Session Management**: Existing session auth system

### File Security

- **Type Validation**: PDF files only
- **Size Limits**: 20MB maximum
- **Signed URLs**: Time-limited download links
- **Storage Isolation**: Dedicated bucket structure

### Data Validation

- **Client-side**: Zod schema validation
- **Server-side**: Comprehensive input validation
- **SQL Injection**: Protected via Drizzle ORM
- **XSS Protection**: Input sanitization

## Feature Flags

The admissions feature is controlled by the `admissions` feature flag:

- **Enabled**: Public form and admin interface accessible
- **Disabled**: Feature hidden from navigation and routes

## Integration Points

### Navigation

- **Public Nav**: "Admissions" link in main navigation
- **Admin Nav**: "Gérer les candidatures" in admin dashboard

### Maintenance Mode

- **Public Form**: Gated by maintenance mode (like other public pages)
- **Admin Interface**: Remains accessible during maintenance

### i18n Support

- **Translations**: French, English, Arabic support
- **Form Labels**: Localized field labels and messages
- **Status Labels**: Localized status descriptions

## Usage Examples

### Submitting an Application

1. User visits `/admissions`
2. Fills out the application form
3. Uploads combined PDF (bac + licence + CIN)
4. Submits form
5. Receives confirmation with next steps

### Managing Applications (Admin)

1. Admin visits `/admin/admissions`
2. Views list of applications with filters
3. Clicks on application to view details
4. Downloads PDF for review
5. Updates status and adds notes
6. Saves changes

## Error Handling

### Client-side Errors

- **Validation Errors**: Field-specific error messages
- **File Errors**: Size and type validation
- **Network Errors**: Toast notifications with retry options

### Server-side Errors

- **Validation Errors**: Structured error responses
- **Storage Errors**: Graceful fallback with user feedback
- **Database Errors**: Logged and handled appropriately

## Performance Considerations

### Database Optimization

- **Indexes**: Strategic indexing for common queries
- **Pagination**: Efficient large dataset handling
- **Selective Loading**: Only required fields loaded

### File Storage

- **CDN**: Supabase Storage with global CDN
- **Caching**: Appropriate cache headers
- **Compression**: Automatic file compression

## Testing

### Manual Testing Checklist

- [ ] Public form submission with valid data
- [ ] Public form validation with invalid data
- [ ] PDF upload with various file types/sizes
- [ ] Admin list view with filters
- [ ] Admin detail view and status updates
- [ ] PDF download functionality
- [ ] Feature flag enable/disable
- [ ] Maintenance mode integration
- [ ] Mobile responsiveness
- [ ] i18n language switching

### Automated Testing

- **Unit Tests**: Form validation, API endpoints
- **Integration Tests**: End-to-end application flow
- **Security Tests**: File upload validation, admin access

## Deployment Notes

### Environment Variables

Ensure these are configured:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

### Database Migration

Run the migration before deployment:
```bash
supabase db push
```

### Storage Bucket

Ensure the `documents` bucket exists in Supabase with appropriate policies.

## Future Enhancements

### Potential Improvements

1. **Email Notifications**: Automatic emails on status changes
2. **Application Tracking**: Public tracking page for applicants
3. **Bulk Operations**: Mass status updates for admins
4. **Advanced Filtering**: More sophisticated search options
5. **Export Features**: CSV/Excel export of applications
6. **Interview Scheduling**: Integrated calendar for interviews
7. **Document Templates**: Standardized application templates
8. **Analytics Dashboard**: Application statistics and trends
