-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the disasters table
CREATE TABLE public.disasters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location_name TEXT,
  location GEOGRAPHY(POINT, 4326),
  description TEXT,
  tags TEXT[],
  owner_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  audit_trail JSONB DEFAULT '[]'::jsonb
);

-- Create the reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES public.disasters(id) ON DELETE CASCADE,
  user_id TEXT,
  content TEXT,
  image_url TEXT,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create the resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_id UUID REFERENCES public.disasters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location_name TEXT,
  location GEOGRAPHY(POINT, 4326),
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create the cache table
CREATE TABLE public.cache (
  key TEXT PRIMARY KEY,
  value JSONB,
  expires_at TIMESTAMPTZ NOT NULL
);

-- Create Geospatial indexes for performance
CREATE INDEX disasters_location_idx ON public.disasters USING GIST (location);
CREATE INDEX resources_location_idx ON public.resources USING GIST (location);

-- Create other indexes for query optimization
CREATE INDEX disasters_tags_idx ON public.disasters USING GIN (tags);
CREATE INDEX disasters_owner_idx ON public.disasters (owner_id);
CREATE INDEX cache_expires_idx ON public.cache (expires_at);

-- Add comments to tables and columns for clarity
COMMENT ON TABLE public.disasters IS 'Stores information about disaster events.';
COMMENT ON COLUMN public.disasters.location IS 'Stores the geographic location (Point) of the disaster.';
COMMENT ON TABLE public.reports IS 'Stores user-submitted reports related to a disaster.';
COMMENT ON TABLE public.resources IS 'Stores information about available resources for a disaster.';
COMMENT ON COLUMN public.resources.location IS 'Stores the geographic location (Point) of the resource.';
COMMENT ON TABLE public.cache IS 'Stores cached responses from external APIs to reduce latency and rate limit usage.';

-- Create a function for finding nearby resources
CREATE OR REPLACE FUNCTION find_nearby_resources(
  lat float,
  lon float,
  radius float
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  location_name TEXT,
  type TEXT,
  distance float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.name,
    r.location_name,
    r.type,
    ST_Distance(r.location, ST_SetSRID(ST_MakePoint(lon, lat), 4326)) as distance
  FROM
    public.resources AS r
  WHERE
    ST_DWithin(r.location, ST_SetSRID(ST_MakePoint(lon, lat), 4326), radius)
  ORDER BY
    distance;
END;
$$ LANGUAGE plpgsql;
