import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import MainNavbar from './components/common/MainNavbar';
import Footer from './components/common/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import styled from 'styled-components';
import BackToTopButton from './components/common/BackToTop';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const AllCourses = lazy(() => import('./pages/AllCourses'));
const Contact = lazy(() => import('./pages/Contact'));
const StudentDashboard = lazy(() => import('./components/student/StudentDashboard'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

const { Content } = Layout;

const StyledContent = styled(Content)`
	min-height: calc(100vh - 64px - 70px);
	background: #fff;
`;

const LoadingSpinner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: calc(100vh - 64px - 70px);
`;

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return <LoadingSpinner><Spin size="large" /></LoadingSpinner>;
	}

	if (!user) {
		return <Navigate to="/" replace />;
	}

	if (allowedRole && user.role !== allowedRole) {
		return <Navigate to="/" replace />;
	}

	return children;
};

function AppContent() {
	return (
		<Router>
			<Layout>
				<BackToTopButton />
				<Suspense fallback={
					<LoadingSpinner>
						<Spin size="large" />
					</LoadingSpinner>
				}>
					<Routes>
						{/* Public routes with MainNavbar and Footer */}
						<Route path="/" element={
							<>
								<MainNavbar />
								<StyledContent>
									<Home />
								</StyledContent>
								<Footer />
							</>
						} />
						<Route path="/about" element={
							<>
								<MainNavbar />
								<StyledContent>
									<About />
								</StyledContent>
								<Footer />
							</>
						} />
						<Route path="/allcourses" element={
							<>
								<MainNavbar />
								<StyledContent>
									<AllCourses />
								</StyledContent>
								<Footer />
							</>
						} />
						<Route path="/contact" element={
							<>
								<MainNavbar />
								<StyledContent>
									<Contact />
								</StyledContent>
								<Footer />
							</>
						} />


						{/* Protected routes without MainNavbar and Footer */}
						<Route 
							path="/student-dashboard/:id/*" 
							element={
								<ProtectedRoute allowedRole="ROLE_STUDENT">
									<StudentDashboard />
								</ProtectedRoute>
							} 
						/>
						<Route 
							path="/admin-dashboard/*" 
							element={
								<ProtectedRoute allowedRole="ROLE_ADMIN">
									<AdminDashboard />
								</ProtectedRoute>
							} 
						/>
					</Routes>
				</Suspense>
			</Layout>
		</Router>
	);
}

function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
}

export default App;