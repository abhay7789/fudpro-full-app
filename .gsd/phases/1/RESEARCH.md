# Phase 1 Research: Stabilization & Cleanup

## Status
- **Existing Tests**: None found in `backend` or `frontend`.
- **Infrastructure Needs**: Need to establish testing patterns for both layers.
- **Role Logic**: Spread across multiple page files in `frontend/src/pages/`. Need to consolidate into a central hook or service.

## Chosen Tools
- **Frontend**: Vitest (natively supported by Vite projects).
- **Backend**: Jest with Supertest (standard for Express/Sequelize).
- **Consolidation**: Create `useRoleAccess` hook in `frontend` and `authService` enhancements in `backend`.

## Technical Gaps
- Lack of schema validation for API inputs.
- No centralized error handling middleware that captures Winston logs properly.
