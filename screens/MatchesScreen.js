import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LeagueHeader = ({ league }) => (
  <View style={styles.leagueHeader}>
    <Image source={{ uri: league.logo }} style={styles.leagueLogo} />
    <Text style={styles.leagueName}>{league.title}</Text>
  </View>
);

const MatchCard = ({ match }) => {
  const time = new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <View style={styles.matchCard}>
      <View style={styles.teamContainer}>
        <Image source={{ uri: match.homeTeam.crest }} style={styles.logo} />
        <Text style={styles.teamName} numberOfLines={1} ellipsizeMode='tail'>{match.homeTeam.name}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{time}</Text>
        {match.channels && (
          <Text style={styles.channelInfo}>{match.channels.join(', ')}</Text>
        )}
      </View>
      <View style={[styles.teamContainer, { justifyContent: 'flex-end' }]}>
        <Text style={styles.teamName} numberOfLines={1} ellipsizeMode='tail'>{match.awayTeam.name}</Text>
        <Image source={{ uri: match.awayTeam.crest }} style={styles.logo} />
      </View>
    </View>
  );
};

const MatchesScreen = () => {
  const [groupedMatches, setGroupedMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const groupMatchesByCompetition = (matches) => {
    const groups = matches.reduce((acc, match) => {
      const competitionName = match.competition.name;
      if (!acc[competitionName]) {
        acc[competitionName] = {
          title: competitionName,
          logo: match.competition.emblem,
          data: [],
        };
      }
      acc[competitionName].data.push(match);
      return acc;
    }, {});
    return Object.values(groups);
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('https://api.football-data.org/v4/matches', {
          headers: {
            'X-Auth-Token': 'f4f0ff330cbe48a0a309449ad5db5b6b',
          },
        });
        const data = await response.json();
        setGroupedMatches(groupMatchesByCompetition(data.matches));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={groupedMatches}
        renderItem={({ item }) => <MatchCard match={item} />}
        renderSectionHeader={({ section }) => <LeagueHeader league={section} />}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  leagueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  leagueLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  matchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.4,
  },
  logo: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  teamName: {
    fontSize: 16,
    flex: 1,
  },
  timeContainer: {
    flex: 0.2,
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  channelInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default MatchesScreen;

