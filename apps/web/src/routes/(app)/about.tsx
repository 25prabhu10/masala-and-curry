import { Button } from '@mac/web-ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { Award, Heart, Users, Utensils } from 'lucide-react'

export const Route = createFileRoute('/(app)/about')({
  component: About,
})

function About() {
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Our Story
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A journey that began with a passion for authentic flavors and a dream to share the
              culinary treasures of India and Nepal with our community.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                From Heritage to Your Table
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2018 by Chef Rajesh Sharma and his wife Priya, Masala & Curry was born
                  from a deep love for the diverse culinary traditions of South Asia. Having grown
                  up in the bustling streets of Delhi and the serene mountains of Kathmandu, our
                  founders understood that food is more than sustenance—it&apos;s a bridge between
                  cultures.
                </p>
                <p>
                  Our menu celebrates this beautiful fusion, offering the bold, aromatic spices of
                  Indian cuisine alongside the comforting, hearty flavors of Nepalese cooking. Every
                  dish is prepared using traditional techniques and family recipes passed down
                  through generations.
                </p>
                <p>
                  Today, we&apos;re proud to serve our community with authentic flavors, fresh
                  ingredients, and the warm hospitality that defines both Indian and Nepalese
                  cultures.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center space-y-4">
                  {/* <div className="text-6xl">👨‍🍳</div> */}
                  <img
                    alt="Chef Rajesh"
                    className="w-full h-auto rounded-lg shadow-lg"
                    src="/images/chef.jpg"
                  />
                  {/* <p className="text-muted-foreground">Chef & Founders</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from sourcing ingredients to serving our
              guests
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div className="text-center space-y-4" key={value.title}>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind every delicious meal and warm welcome
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                className="bg-card rounded-xl p-8 border border-border text-center space-y-4"
                key={member.name}
              >
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{member.emoji}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Awards & Recognition</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {awards.map((award) => (
              <div
                className="bg-card rounded-xl p-8 border border-border text-center space-y-4"
                key={award.title}
              >
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{award.title}</h3>
                  <p className="text-primary font-medium">{award.year}</p>
                </div>
                <p className="text-muted-foreground text-sm">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Experience Our Story</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join us for an unforgettable culinary journey through the flavors of India and Nepal.
              Whether dining in or ordering online, every meal is prepared with love and tradition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="text-lg px-8 py-3" size="lg">
                Make Reservation
              </Button>
              <Button className="text-lg px-8 py-3" size="lg" variant="outline">
                Order Online
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const values = [
  {
    description:
      'Every recipe honors traditional cooking methods and genuine flavors from our homeland',
    icon: Heart,
    title: 'Authenticity',
  },
  {
    description: 'We source the finest ingredients and prepare everything fresh daily with care',
    icon: Utensils,
    title: 'Quality',
  },
  {
    description: 'Building connections through food and sharing our culture with our neighbors',
    icon: Users,
    title: 'Community',
  },
  {
    description: 'Committed to delivering exceptional dining experiences in every interaction',
    icon: Award,
    title: 'Excellence',
  },
]

const team = [
  {
    description:
      'With 20 years of experience in Indian cuisine, Chef Rajesh brings authentic flavors from Delhi to your table',
    emoji: '👨‍🍳',
    name: 'Chef Rajesh Sharma',
    role: 'Head Chef & Co-Founder',
  },
  {
    description:
      'Priya ensures every guest feels the warmth of Nepalese hospitality in our welcoming atmosphere',
    emoji: '👩‍💼',
    name: 'Priya Sharma',
    role: 'Operations Manager & Co-Founder',
  },
  {
    description:
      'Specializing in traditional momos and Nepalese dishes, Kumar adds authentic mountain flavors to our menu',
    emoji: '👨‍🍳',
    name: 'Kumar Patel',
    role: 'Sous Chef',
  },
]

const awards = [
  {
    organization: 'Local Dining Awards',
    title: 'Best Indian Restaurant',
    year: '2023',
  },
  {
    organization: 'Restaurant Association',
    title: 'Excellence in Service',
    year: '2022',
  },
  {
    organization: 'City Chamber of Commerce',
    title: 'Community Choice Award',
    year: '2021',
  },
]
