import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

import { formatDate } from "../lib/formatDate.js";


const Home = () => {
	// Format date to be more readable
	const user = useSelector((state) => state.auth.user);

	return (
		<>
			{user && (
				<Card className='w-full max-w-md my-auto mx-auto'>
					<CardHeader>
						<div className='flex justify-between items-start'>
							<div>
								<CardTitle className='text-2xl'>
									{user?.username}
								</CardTitle>
								<CardDescription>{user?.email}</CardDescription>
							</div>
							<Badge
								variant={
									user?.status === "active"
										? "default"
										: "destructive"
								}>
								{user?.status.toUpperCase()}
							</Badge>
						</div>
					</CardHeader>

					<CardContent className='space-y-4'>
						<div className='flex justify-between'>
							<span className='text-sm text-gray-500'>Role:</span>
							<span className='text-sm font-medium'>
								{user?.role.charAt(0).toUpperCase() +
									user?.role.slice(1)}
							</span>
						</div>

						<div className='flex justify-between'>
							<span className='text-sm text-gray-500'>
								Verified:
							</span>
							<span className='text-sm font-medium'>
								{user?.isVerified ? "Yes" : "No"}
							</span>
						</div>

						<div className='flex justify-between'>
							<span className='text-sm text-gray-500'>
								Member since:
							</span>
							<span className='text-sm font-medium'>
								{formatDate(user?.createdAt)}
							</span>
						</div>

						<div className='flex justify-between'>
							<span className='text-sm text-gray-500'>
								Last updated:
							</span>
							<span className='text-sm font-medium'>
								{formatDate(user?.updatedAt)}
							</span>
						</div>

						<div className='flex gap-2 pt-4'>
							<Button
								variant='outline'
								className='w-full'
								onClick={() =>
									toast.error(
										"Edit Profile is not available yet.",
									)
								}>
								Edit Profile
							</Button>
							<Button
								className='w-full'
								onClick={() =>
									toast.error(
										"View Activity is not available yet.",
									)
								}>
								View Activity
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
};

export default Home;
