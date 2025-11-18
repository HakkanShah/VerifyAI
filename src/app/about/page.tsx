import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Award, Bot, Github, Linkedin, ShieldCheck, Star, Zap } from 'lucide-react';

const teamMembers = [
    {
      name: 'Hakkan Shah',
      role: 'Team Leader & Lead Architect',
      avatar: 'https://github.com/HakkanShah.png',
      github: 'https://github.com/HakkanShah',
      linkedin: 'https://linkedin.com/in/hakkan',
    },
    {
      name: 'Janmejoy Mahato',
      role: 'Cybersecurity Analyst',
      avatar: 'https://github.com/janmej0y.png',
      github: 'https://github.com/janmej0y',
      linkedin: 'https://www.linkedin.com/in/janmej0y',
    },
    {
      name: 'Suman Karmakar',
      role: 'AI & Machine Learning Dev',
      avatar:
        'https://scontent.fccu27-1.fna.fbcdn.net/v/t39.30808-6/471655098_1218178790065876_3162592232655518697_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=roIRGVL_l9YQ7kNvwELsBcg&_nc_oc=AdmV9fKgG4L10ePAuzrbEbFjOVRNfNRlwEa83vDYej_2kZ_vDGXxl2KesQqJtHzf2-YJrpCo2RpY7yvzdKUryipE&_nc_zt=23&_nc_ht=scontent.fccu27-1.fna&_nc_gid=0Z1ExFJCQkjVMkQx5tF-Tw&oh=00_AfXDIuJdN1jJSlJXpwU3JK_GfMU98zaQzB_x8RwsokMI0g&oe=68B7962A',
      github: 'https://github.com/SumanKarmakar0',
      linkedin: 'https://www.linkedin.com/in/suman-karmakar-8826312ba',
    },
    {
      name: 'Sourav Chowdhury',
      role: 'Frontend Specialist',
      avatar: 'https://github.com/sourav81R.png',
      github: 'https://github.com/sourav81R',
      linkedin: 'https://www.linkedin.com/in/souravchowdhury-2003r',
    },
    {
      name: 'Avishek Giri',
      role: 'Backend Engineer',
      avatar: 'https://github.com/imavishek-coder.png',
      github: 'https://github.com/imavishek-coder',
      linkedin: 'https://www.linkedin.com/in/imavishek-coder',
    },
    {
      name: 'Shankha Shubhra Maity',
      role: 'Database Engineer',
      avatar:
        'https://scontent.fccu27-1.fna.fbcdn.net/v/t39.30808-6/493985125_122209300376086227_6529649451942904340_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_ohc=2m8fv0hBAp0Q7kNvwH1CO8D&_nc_oc=Adm5Fq9Qdhf08qIB5lsLxKS_68jp_NOE5guBi-4lkG93MkB72IHCYXYGZhSMpN67RxpyUXv883R3kZqmFj9mJDwv&_nc_zt=23&_nc_ht=scontent.fccu27-1.fna&_nc_gid=-oJUEq7rjUCBcMtmHay2bA&oh=00_AfUOKeZKInWgutpyazAgRQvVJp4RA3EH5pRjJKXIeDa-kw&oe=68B79E09',
      github: 'https://github.com/Shankha-Shubhra',
      linkedin: 'https://www.linkedin.com/in/shankhashubhra-maity-690284376',
    },
    {
      name: 'Mithun Talukdar',
      role: 'UI/UX Specialist',
      avatar:
        'https://scontent.fccu27-1.fna.fbcdn.net/v/t39.30808-6/482208477_675270511851929_8944526403367308764_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ZP8msBapQJUQ7kNvwHhBL2T&_nc_oc=Adn05yP0RR546GGWu4i8c7mwvdkwoIfKl4uVdvodVRnrPSjk4zDeoYJIxctFV60ZW2OOpgdGWlcemSBxK25DkXHw&_nc_zt=23&_nc_ht=scontent.fccu27-1.fna&_nc_gid=hn37b-W4lJc2et0NNSrCNw&oh=00_AfWn22BE2E_V98oTfyGGgn6PbaDpviEz5uQuL1XZArWuXg&oe=68B7C3D9',
      github: '#',
      linkedin: '#',
    },
    {
      name: 'Amalesh Samanta',
      role: 'QA & Testing Specialist',
      avatar:
        'https://media.licdn.com/dms/image/v2/D5603AQFdte1heb1VCQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1701085833411?e=1759363200&v=beta&t=bF09dNjShPfSlGhDYXkWAaE8CT1wqtRNf-s5yPktI84',
      github: 'https://github.com/amalesh19',
      linkedin: 'https://www.linkedin.com/in/amalesh-samanta-7bb562228',
    },
  ];

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="w-full max-w-4xl mx-auto bg-card/70 backdrop-blur-sm border-border/50">
                <CardHeader className="text-center">
                    <h1 className="text-3xl font-bold tracking-tighter text-primary font-headline">About VerifyAI</h1>
                    <p className="text-muted-foreground">Unmasking the truth in the digital world.</p>
                </CardHeader>
                <CardContent className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold text-accent mb-4 font-headline text-center">// MISSION_STATEMENT //</h2>
                        <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
                            VerifyAI is a next-generation deepfake and fake news detection platform. Powered by advanced machine learning models, it analyzes text, images, and videos to uncover digital manipulation and protect you from misinformation.
                        </p>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-2xl font-semibold text-accent mb-6 font-headline text-center">// CORE_DIRECTIVES //</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="flex flex-col items-center p-4">
                                <Zap className="h-10 w-10 text-primary mb-3" />
                                <h3 className="font-semibold text-lg">Blazing Fast Analysis</h3>
                                <p className="text-muted-foreground text-sm">Real-time results in seconds.</p>
                            </div>
                            <div className="flex flex-col items-center p-4">
                                <ShieldCheck className="h-10 w-10 text-primary mb-3" />
                                <h3 className="font-semibold text-lg">High-Fidelity Accuracy</h3>
                                <p className="text-muted-foreground text-sm">Cutting-edge models for reliable detection.</p>
                            </div>
                            <div className="flex flex-col items-center p-4">
                                <Star className="h-10 w-10 text-primary mb-3" />
                                <h3 className="font-semibold text-lg">Intuitive & Easy to Use</h3>
                                <p className="text-muted-foreground text-sm">Seamless verification for everyone.</p>
                            </div>
                        </div>
                    </section>

                    <Separator />

                    <section>
                        <h2 className="text-2xl font-semibold text-accent mb-6 font-headline text-center">// THE_SQUAD //</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {teamMembers.map((member) => (
                                <div key={member.name} className="flex flex-col items-center text-center">
                                    <Avatar className="h-20 w-20 mb-3">
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h4 className="font-semibold">{member.name}</h4>
                                    <p className="text-xs text-muted-foreground mb-2">{member.role}</p>
                                    <div className="flex items-center gap-3">
                                        <a href={member.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                            <Github className="h-4 w-4" />
                                        </a>
                                        <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    <Separator />

                    <section>
                        <h2 className="text-2xl font-semibold text-accent mb-6 font-headline text-center">// SPECIAL_THANKS //</h2>
                        <div className="flex flex-col items-center text-center">
                            <Award className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold">Raghunath Maji Sir</h3>
                            <p className="text-muted-foreground">Asst. Professor, Greater Kolkata College of Engineering and Management</p>
                            <p className="text-sm text-accent">Mentor & Project Guide</p>
                        </div>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
