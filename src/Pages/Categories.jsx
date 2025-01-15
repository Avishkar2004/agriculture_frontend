import BugReportIcon from '@mui/icons-material/BugReport';
import CategoryIcon from '@mui/icons-material/Category';
import GrassIcon from '@mui/icons-material/Grass';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ParkIcon from '@mui/icons-material/Park';
import React from 'react';
import { Link } from 'react-router-dom';
const categoriesData = [
    { name: 'Plant Growth Regulator', icon: <CategoryIcon className="text-purple-500" />, route: '/plantgrowthregulator' },
    { name: 'Organic Products', icon: <ParkIcon className="text-orange-500" />, route: '/organicproduct' },
    { name: 'Micro-nutrients', icon: <GrassIcon className="text-yellow-500" />, route: '/micro-nutrients' },
    { name: 'Insecticides', icon: <BugReportIcon className="text-blue-500" />, route: '/insecticide' },
    { name: 'Fungicides', icon: <LocalFloristIcon className="text-green-500" />, route: '/fungicides' },
];

const Categories = () => {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Categories</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoriesData.map((category, index) => (
                    <Link
                        key={index}
                        to={category.route}
                        className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
                    >
                        <div className="flex items-center justify-center mb-4">
                            {category.icon}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700 text-center">{category.name}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;
