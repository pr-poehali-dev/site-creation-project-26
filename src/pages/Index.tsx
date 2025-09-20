import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: string;
  tags: string[];
  conversations: number;
  isOnline: boolean;
}

const characters: Character[] = [
  {
    id: '1',
    name: 'Нейрон',
    description: 'Футуристический ИИ-помощник с обширными знаниями в области технологий и науки',
    avatar: '/img/0c0efcdc-6d84-4d38-9d9e-fca128ca1508.jpg',
    category: 'Технологии',
    tags: ['ИИ', 'Наука', 'Технологии'],
    conversations: 15420,
    isOnline: true
  },
  {
    id: '2',
    name: 'Астра',
    description: 'Мудрая космическая сущность, знающая тайны вселенной и межгалактических цивилизаций',
    avatar: '/img/bdce7b84-161a-484a-afb7-9b711947771b.jpg',
    category: 'Космос',
    tags: ['Космос', 'Философия', 'Мудрость'],
    conversations: 8930,
    isOnline: true
  },
  {
    id: '3',
    name: 'Мудрец',
    description: 'Древний хранитель знаний, объединяющий мудрость веков с футуристическими технологиями',
    avatar: '/img/daf5af85-f78e-49e2-b76c-3f67ab39078f.jpg',
    category: 'Мудрость',
    tags: ['История', 'Знания', 'Наставничество'],
    conversations: 12100,
    isOnline: false
  }
];

function Index() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; text: string; isUser: boolean; timestamp: Date }>>([]);
  const [inputMessage, setInputMessage] = useState('');

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    char.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sendMessage = () => {
    if (!inputMessage.trim() || !selectedCharacter) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: `Привет! Я ${selectedCharacter.name}. ${selectedCharacter.description}. Я запомню наш разговор и буду развиваться в процессе общения.`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputMessage('');
  };

  if (selectedCharacter) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex h-screen">
          {/* Chat Sidebar */}
          <div className="w-80 border-r border-border bg-card/50">
            <div className="p-4 border-b border-border">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCharacter(null)}
                className="mb-4 hover:bg-secondary"
              >
                <Icon name="ArrowLeft" size={16} />
                <span className="ml-2">Назад к персонажам</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/50">
                  <AvatarImage src={selectedCharacter.avatar} alt={selectedCharacter.name} />
                  <AvatarFallback>{selectedCharacter.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-orbitron font-semibold">{selectedCharacter.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${selectedCharacter.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-sm text-muted-foreground">
                      {selectedCharacter.isOnline ? 'В сети' : 'Не в сети'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <ScrollArea className="h-full">
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-4">{selectedCharacter.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCharacter.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border bg-card/30">
              <h1 className="font-orbitron text-xl font-bold">
                Чат с {selectedCharacter.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {selectedCharacter.conversations.toLocaleString()} разговоров
              </p>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Avatar className="h-20 w-20 mx-auto mb-4 ring-2 ring-primary/50">
                      <AvatarImage src={selectedCharacter.avatar} alt={selectedCharacter.name} />
                      <AvatarFallback>{selectedCharacter.name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-orbitron text-lg font-semibold mb-2">
                      Начните разговор с {selectedCharacter.name}
                    </h3>
                    <p className="text-muted-foreground">
                      Этот персонаж запомнит вашу историю общения и будет развиваться
                    </p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex space-x-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!message.isUser && (
                        <Avatar className="h-8 w-8 ring-1 ring-primary/30">
                          <AvatarImage src={selectedCharacter.avatar} alt={selectedCharacter.name} />
                          <AvatarFallback>{selectedCharacter.name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-md p-3 rounded-lg ${
                          message.isUser
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.isUser && (
                        <Avatar className="h-8 w-8 ring-1 ring-primary/30">
                          <AvatarFallback>Я</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card/30">
              <div className="flex space-x-2 max-w-4xl mx-auto">
                <Input
                  placeholder="Напишите сообщение..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} className="px-6">
                  <Icon name="Send" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-blue to-primary flex items-center justify-center">
                <Icon name="Bot" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-orbitron text-2xl font-bold bg-gradient-to-r from-cyber-blue to-primary bg-clip-text text-transparent">
                  Universe-world.ai
                </h1>
                <p className="text-sm text-muted-foreground">Вселенная ИИ-персонажей</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              {['Главная', 'Персонажи', 'Создать', 'Библиотека', 'Сообщество'].map((item) => (
                <Button key={item} variant="ghost" className="hover:bg-secondary">
                  {item}
                </Button>
              ))}
              <Button className="bg-gradient-to-r from-cyber-blue to-primary hover:opacity-90">
                Профиль
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-orbitron text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyber-blue via-primary to-electric-purple bg-clip-text text-transparent animate-fade-in">
            Создайте свою вселенную
          </h2>
          <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
            Общайтесь с ИИ-персонажами, которые запоминают каждый разговор и развиваются вместе с вами
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-cyber-blue to-primary hover:opacity-90 animate-scale-in">
              <Icon name="Plus" size={20} />
              <span className="ml-2">Создать персонажа</span>
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 animate-scale-in">
              <Icon name="Explore" size={20} />
              <span className="ml-2">Исследовать</span>
            </Button>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Найти персонажа по имени, описанию или тегам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg bg-card/50 border-primary/30 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Characters Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-orbitron text-3xl font-bold">Популярные персонажи</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Все категории</Button>
              <Button variant="outline" size="sm">Рекомендуемые</Button>
              <Button variant="outline" size="sm">Новые</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map((character) => (
              <Card 
                key={character.id} 
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50"
                onClick={() => setSelectedCharacter(character)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-2 ring-primary/50 group-hover:ring-primary transition-all duration-300">
                        <AvatarImage src={character.avatar} alt={character.name} />
                        <AvatarFallback className="bg-gradient-to-br from-cyber-blue to-primary text-white font-orbitron">
                          {character.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${
                        character.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="font-orbitron text-lg group-hover:text-primary transition-colors">
                        {character.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {character.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-sm mb-4 line-clamp-2">
                    {character.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {character.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-primary/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={14} />
                      <span>{character.conversations.toLocaleString()}</span>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-cyber-blue to-primary hover:opacity-90">
                      <Icon name="MessageSquare" size={14} />
                      <span className="ml-1">Чат</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCharacters.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-orbitron text-xl font-semibold mb-2">Персонажи не найдены</h3>
              <p className="text-muted-foreground">Попробуйте изменить поисковый запрос</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-orbitron font-semibold mb-4">Universe-world.ai</h4>
              <p className="text-sm text-muted-foreground">
                Платформа для создания и общения с ИИ-персонажами нового поколения
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Функции</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Создать персонажа</li>
                <li>Библиотека</li>
                <li>Сценарии</li>
                <li>Голоса</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Сообщество</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Группы</li>
                <li>Истории</li>
                <li>Чаты</li>
                <li>Рекомендуемые</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Поддержка</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Узнать</li>
                <li>Помощь</li>
                <li>Контакты</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;