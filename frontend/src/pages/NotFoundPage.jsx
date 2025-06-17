import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
	const navigate = useNavigate();
	return (
		<div className='min-h-screen flex items-center justify-center bg-background p-4'>
			<Card className='w-full max-w-md text-center'>
				<CardContent className='pt-6'>
					<div className='space-y-6'>
						{/* 404 Number */}
						<div className='space-y-2'>
							<h1 className='text-8xl font-bold text-primary'>
								404
							</h1>
							<div className='w-24 h-1 bg-primary mx-auto rounded-full'></div>
						</div>

						{/* Error Message */}
						<div className='space-y-2'>
							<h2 className='text-2xl font-semibold text-foreground'>
								Page Not Found
							</h2>
							<p className='text-muted-foreground'>
								Sorry, the page you are looking for doesn't
								exist or has been moved.
							</p>
						</div>

						{/* Action Buttons */}
						<div className='flex flex-col sm:flex-row gap-3 pt-4'>
							<Button
								asChild
								className='flex-1'>
								<Link to='/'>
									<Home className='w-4 h-4 mr-2' />
									Go Home
								</Link>
							</Button>
							<Button
								variant='outline'
								onClick={() => navigate(-1)}
								className='flex-1'>
								<ArrowLeft className='w-4 h-4 mr-2' />
								Go Back
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
