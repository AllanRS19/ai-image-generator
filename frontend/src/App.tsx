import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import GeneratePage from './pages/GeneratePage';
import FeedPage from './pages/FeedPage';
import HistoryPage from './pages/HistoryPage';
import CollectionsPage from './pages/CollectionsPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { Toaster } from 'sileo';

const App = () => {
    return (
        <>
            <Toaster position='top-right' />
            <Routes>
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route element={<Layout />}>
                    <Route path="/" element={<GeneratePage />} />
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;