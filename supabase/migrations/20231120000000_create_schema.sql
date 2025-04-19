-- Create enum types
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.user_role AS ENUM ('user', 'venue_owner', 'admin');
CREATE TYPE public.tutorial_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE public.tutorial_progress AS ENUM ('not_started', 'in_progress', 'completed');

-- Create profiles table extension
ALTER TABLE public.profiles 
ADD COLUMN role public.user_role NOT NULL DEFAULT 'user'::public.user_role,
ADD COLUMN email text;

-- Create venues table
CREATE TABLE public.venues (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id),
  name text NOT NULL,
  description text,
  location text NOT NULL,
  address text NOT NULL,
  amenities jsonb,
  images text[],
  hourly_price numeric NOT NULL,
  half_day_price numeric,
  full_day_price numeric,
  sport_type text NOT NULL,
  capacity integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create venue availability table
CREATE TABLE public.venue_availability (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  venue_id uuid NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL, -- 0 = Sunday, 6 = Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create venue bookings table
CREATE TABLE public.venue_bookings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  venue_id uuid NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  total_price numeric NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending'::public.booking_status,
  payment_status public.payment_status NOT NULL DEFAULT 'pending'::public.payment_status,
  payment_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create equipment table
CREATE TABLE public.equipment (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  brand text NOT NULL,
  images text[],
  hourly_price numeric NOT NULL,
  daily_price numeric NOT NULL,
  weekly_price numeric NOT NULL,
  total_quantity integer NOT NULL,
  available_quantity integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create equipment rentals table
CREATE TABLE public.equipment_rentals (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  equipment_id uuid NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  total_price numeric NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending'::public.booking_status,
  payment_status public.payment_status NOT NULL DEFAULT 'pending'::public.payment_status,
  payment_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create tutorials table
CREATE TABLE public.tutorials (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  sport_category text NOT NULL,
  difficulty public.tutorial_difficulty NOT NULL DEFAULT 'beginner'::public.tutorial_difficulty,
  instructor_id uuid REFERENCES public.profiles(id),
  video_url text,
  thumbnail text,
  duration integer,
  is_premium boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create tutorial lessons table
CREATE TABLE public.tutorial_lessons (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  tutorial_id uuid NOT NULL REFERENCES public.tutorials(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text,
  duration integer,
  sequence_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create user tutorial progress table
CREATE TABLE public.user_tutorial_progress (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  tutorial_id uuid NOT NULL REFERENCES public.tutorials(id) ON DELETE CASCADE,
  current_lesson_id uuid REFERENCES public.tutorial_lessons(id),
  progress public.tutorial_progress NOT NULL DEFAULT 'not_started'::public.tutorial_progress,
  completed_lessons integer NOT NULL DEFAULT 0,
  total_lessons integer NOT NULL,
  last_accessed timestamptz NOT NULL DEFAULT now(),
  completion_date timestamptz,
  certificate_issued boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, tutorial_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  type text,
  entity_type text,
  entity_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create indexes for common queries
CREATE INDEX idx_venues_sport_type ON public.venues(sport_type);
CREATE INDEX idx_venues_location ON public.venues USING gin(location gin_trgm_ops);
CREATE INDEX idx_venue_bookings_user_id ON public.venue_bookings(user_id);
CREATE INDEX idx_venue_bookings_venue_id ON public.venue_bookings(venue_id);
CREATE INDEX idx_venue_bookings_date ON public.venue_bookings(booking_date);
CREATE INDEX idx_equipment_category ON public.equipment(category);
CREATE INDEX idx_equipment_rentals_user_id ON public.equipment_rentals(user_id);
CREATE INDEX idx_tutorials_sport_category ON public.tutorials(sport_category);
CREATE INDEX idx_tutorials_difficulty ON public.tutorials(difficulty);
CREATE INDEX idx_user_tutorial_progress_user_id ON public.user_tutorial_progress(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- Configure row-level security (RLS)
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tutorial_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for venues
CREATE POLICY "Venues are viewable by everyone" 
  ON public.venues FOR SELECT USING (true);
  
CREATE POLICY "Venues can be inserted by venue owners and admins" 
  ON public.venues FOR INSERT 
  WITH CHECK ((auth.uid() = owner_id) AND 
              (EXISTS (SELECT 1 FROM public.profiles 
                      WHERE id = auth.uid() AND 
                      (role = 'venue_owner' OR role = 'admin'))));
  
CREATE POLICY "Venues can be updated by their owners and admins" 
  ON public.venues FOR UPDATE 
  USING ((auth.uid() = owner_id) OR 
         (EXISTS (SELECT 1 FROM public.profiles 
                 WHERE id = auth.uid() AND role = 'admin')));

-- Create policies for venue availability
CREATE POLICY "Venue availability is viewable by everyone" 
  ON public.venue_availability FOR SELECT USING (true);
  
CREATE POLICY "Venue availability can be managed by venue owners and admins" 
  ON public.venue_availability FOR ALL 
  USING ((EXISTS (SELECT 1 FROM public.venues 
                 WHERE venues.id = venue_id AND 
                 venues.owner_id = auth.uid())) OR 
         (EXISTS (SELECT 1 FROM public.profiles 
                 WHERE id = auth.uid() AND role = 'admin')));

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" 
  ON public.venue_bookings FOR SELECT 
  USING (auth.uid() = user_id OR 
         EXISTS (SELECT 1 FROM public.venues 
                WHERE venues.id = venue_id AND 
                venues.owner_id = auth.uid()) OR
         EXISTS (SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role = 'admin'));
  
CREATE POLICY "Users can create their own bookings" 
  ON public.venue_bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own pending bookings" 
  ON public.venue_bookings FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'pending') 
  WITH CHECK (auth.uid() = user_id AND status = 'pending');
  
CREATE POLICY "Venue owners can update bookings for their venues" 
  ON public.venue_bookings FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.venues 
                WHERE venues.id = venue_id AND 
                venues.owner_id = auth.uid()));
  
CREATE POLICY "Admins can update any booking" 
  ON public.venue_bookings FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role = 'admin'));

-- Create storage buckets
INSERT INTO storage.buckets (id, name) VALUES ('images', 'Images for venues and equipment');
INSERT INTO storage.buckets (id, name) VALUES ('tutorials', 'Tutorial videos and thumbnails');
INSERT INTO storage.buckets (id, name) VALUES ('avatars', 'User profile pictures');

-- Set up storage policies
CREATE POLICY "Images are publicly accessible" 
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');
  
CREATE POLICY "Authenticated users can upload images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id IN ('images', 'avatars') AND auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own uploads" 
  ON storage.objects FOR UPDATE 
  USING (auth.uid() = owner);
  
CREATE POLICY "Tutorial content is publicly accessible" 
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tutorials');
  
CREATE POLICY "Only admins can upload tutorial content" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'tutorials' AND 
              EXISTS (SELECT 1 FROM public.profiles 
                     WHERE id = auth.uid() AND role = 'admin'));

-- Set up functions for checking availability
CREATE OR REPLACE FUNCTION check_venue_booking_conflict(
  venue_id_param UUID,
  booking_date_param DATE,
  start_time_param TIME,
  end_time_param TIME
) RETURNS BOOLEAN AS $$
DECLARE
  conflict_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM venue_bookings
    WHERE venue_id = venue_id_param
    AND booking_date = booking_date_param
    AND status != 'cancelled'
    AND (
      (start_time <= start_time_param AND end_time > start_time_param) OR
      (start_time >= start_time_param AND start_time < end_time_param)
    )
  ) INTO conflict_exists;
  
  RETURN conflict_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_equipment_availability(
  equipment_id_param UUID,
  start_date_param DATE,
  end_date_param DATE,
  quantity_param INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  available_qty INTEGER;
  booked_qty INTEGER;
BEGIN
  -- Get the total available quantity
  SELECT available_quantity INTO available_qty
  FROM equipment
  WHERE id = equipment_id_param;
  
  -- Get the quantity that's already booked for this period
  SELECT COALESCE(SUM(quantity), 0) INTO booked_qty
  FROM equipment_rentals
  WHERE equipment_id = equipment_id_param
  AND status != 'cancelled'
  AND (
    (start_date <= start_date_param AND end_date >= start_date_param) OR
    (start_date >= start_date_param AND start_date <= end_date_param)
  );
  
  -- Check if there's enough quantity available
  RETURN (available_qty - booked_qty) >= quantity_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 