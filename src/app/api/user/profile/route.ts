import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Extract and verify session using better-auth
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    // Query user profile from database
    const userProfile = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        location: user.location,
        village: user.village,
        district: user.district,
        state: user.state,
      })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    // Check if user exists
    if (userProfile.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Return user profile data (excluding sensitive fields)
    return NextResponse.json(userProfile[0], { status: 200 });

  } catch (error) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}

// PATCH handler - Update user location
export async function PATCH(request: NextRequest) {
  try {
    // Extract and verify session using better-auth
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { location } = body;

    if (!location || typeof location !== 'string') {
      return NextResponse.json(
        { 
          error: 'Location is required',
          code: 'MISSING_LOCATION' 
        },
        { status: 400 }
      );
    }

    // Sanitize location input
    const trimmedLocation = location.trim();

    if (trimmedLocation.length === 0) {
      return NextResponse.json(
        { 
          error: 'Location cannot be empty',
          code: 'INVALID_LOCATION' 
        },
        { status: 400 }
      );
    }

    // Update user location in database
    const updatedUser = await db
      .update(user)
      .set({ location: trimmedLocation })
      .where(eq(user.id, session.user.id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        location: user.location,
        village: user.village,
        district: user.district,
        state: user.state,
      });

    // Check if user was found and updated
    if (updatedUser.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Return updated user profile
    return NextResponse.json(updatedUser[0], { status: 200 });

  } catch (error) {
    console.error('PATCH /api/user/profile error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}

// PUT handler - Update user profile fields (name, image, village, district, state)
export async function PUT(request: NextRequest) {
  try {
    // Extract and verify session using better-auth
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          code: 'UNAUTHORIZED' 
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, image, village, district, state } = body;

    // Build update object with only provided fields
    const updateData: {
      name?: string;
      image?: string | null;
      village?: string;
      district?: string;
      state?: string;
    } = {};

    if (name !== undefined) {
      if (typeof name !== 'string') {
        return NextResponse.json(
          { 
            error: 'Name must be a string',
            code: 'INVALID_NAME' 
          },
          { status: 400 }
        );
      }
      const trimmedName = name.trim();
      if (trimmedName.length === 0) {
        return NextResponse.json(
          { 
            error: 'Name cannot be empty',
            code: 'INVALID_NAME' 
          },
          { status: 400 }
        );
      }
      updateData.name = trimmedName;
    }

    if (image !== undefined) {
      if (image !== null && typeof image !== 'string') {
        return NextResponse.json(
          { 
            error: 'Image must be a string or null',
            code: 'INVALID_IMAGE' 
          },
          { status: 400 }
        );
      }
      updateData.image = image;
    }

    if (village !== undefined) {
      if (typeof village !== 'string') {
        return NextResponse.json(
          { 
            error: 'Village must be a string',
            code: 'INVALID_VILLAGE' 
          },
          { status: 400 }
        );
      }
      updateData.village = village.trim();
    }

    if (district !== undefined) {
      if (typeof district !== 'string') {
        return NextResponse.json(
          { 
            error: 'District must be a string',
            code: 'INVALID_DISTRICT' 
          },
          { status: 400 }
        );
      }
      updateData.district = district.trim();
    }

    if (state !== undefined) {
      if (typeof state !== 'string') {
        return NextResponse.json(
          { 
            error: 'State must be a string',
            code: 'INVALID_STATE' 
          },
          { status: 400 }
        );
      }
      updateData.state = state.trim();
    }

    // Check if at least one field is provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { 
          error: 'At least one field must be provided',
          code: 'NO_FIELDS_PROVIDED' 
        },
        { status: 400 }
      );
    }

    // Update user profile fields in database
    const updatedUser = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, session.user.id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        location: user.location,
        village: user.village,
        district: user.district,
        state: user.state,
      });

    // Check if user was found and updated
    if (updatedUser.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Return updated user profile
    return NextResponse.json(updatedUser[0], { status: 200 });

  } catch (error) {
    console.error('PUT /api/user/profile error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}