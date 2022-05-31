import { Injectable } from '@angular/core';
import { Profile } from '@stepflow/interfaces';
import { AuthChangeEvent, createClient, PostgrestSingleResponse, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'apps/stepflow/src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    get auth() {
        return this.supabase.auth;
    }

    get user() {
        return this.supabase.auth.user();
    }

    get session() {
        return this.supabase.auth.session();
    }

    get profile(): PromiseLike<PostgrestSingleResponse<Profile>> {
        return (
            this.supabase
                .from('profiles')
                .select('*')
                // .select(`username, website, avatar_url`)
                .eq('id', this.user?.id)
                .single()
        );
    }

    authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
        return this.supabase.auth.onAuthStateChange(callback);
    }

    // signIn(email: string) {
    //     return this.supabase.auth.signIn({ email });
    // }

    signOut() {
        return this.supabase.auth.signOut();
    }

    signIn(email: string, password: string) {
        return this.supabase.auth.signIn({
            email,
            password,
        });
    }

    signUp(email: string, password: string, profile?: Profile, phoneNumber?: string) {
        return this.supabase.auth.signUp(
            {
                email,
                password,
            },
            {
                data: {
                    ...profile,
                },
            }
        );
    }

    updateProfile(profile: Profile) {
        const update = {
            ...profile,
            id: this.user?.id,
            updated_at: new Date(),
        };

        return this.supabase.from('profiles').upsert(update, {
            returning: 'minimal', // Don't return the value after inserting
        });
    }

    // downLoadImage(path: string) {
    //     return this.supabase.storage.from('avatars').download(path);
    // }

    // uploadAvatar(filePath: string, file: File) {
    //     return this.supabase.storage.from('avatars').upload(filePath, file);
    // }
}
