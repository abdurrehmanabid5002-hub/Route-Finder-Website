import math
import json

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2) * math.sin(dLat/2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dLon/2) * math.sin(dLon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

# Core 25 cities from before
core_cities = {
    # Punjab
    'Lahore': [31.5204, 74.3587], 'Faisalabad': [31.4504, 73.1350], 'Multan': [30.1575, 71.5249],
    'Gujranwala': [32.1877, 74.1945], 'Sialkot': [32.4945, 74.5229], 'Rawalpindi': [33.5651, 73.0169],
    'Bahawalpur': [29.3956, 71.6836], 'Sargodha': [32.0740, 72.6861], 'Sahiwal': [30.6682, 73.1114],
    'RahimYarKhan': [28.4212, 70.2989],
    # Sindh
    'Karachi': [24.8607, 67.0011], 'Sukkur': [27.7052, 68.8574], 'Hyderabad': [25.3960, 68.3578],
    'Larkana': [27.5570, 68.2028],
    # KPK
    'Peshawar': [34.0151, 71.5249], 'Abbottabad': [34.1688, 73.2215], 'Swat': [35.2227, 72.4258],
    'Mardan': [34.1986, 72.0404],
    # ICT
    'Islamabad': [33.6844, 73.0479],
    # Balochistan
    'Quetta': [30.1798, 66.9750], 'Gwadar': [25.1264, 62.3225], 'Turbat': [26.0031, 63.0544],
    # GB
    'Gilgit': [35.8819, 74.4643], 'Skardu': [35.2971, 75.6333],
    # AJK
    'Muzaffarabad': [34.3700, 73.4711]
}

# New cities to add
extra_cities = {
    # Punjab
    'Gujrat': [32.5736, 74.0789], 'Sheikhupura': [31.7167, 73.9850], 'Jhang': [31.2781, 72.3317],
    'DeraGhaziKhan': [30.0489, 70.6455], 'Kasur': [31.1154, 74.4436], 'Okara': [30.8138, 73.4534],
    'Chiniot': [31.7200, 72.9789], 'Kamoke': [31.9752, 74.2230], 'Hafizabad': [32.0679, 73.6858],
    'Sadiqabad': [28.3062, 70.1307], 'Burewala': [30.1667, 72.6500], 'Mianwali': [32.5839, 71.5370],
    'Khanewal': [30.3017, 71.9321], 'Jhelum': [32.9405, 73.7276], 'Attock': [33.7667, 72.3667],
    'Bhalwal': [32.2654, 72.8981], 'MandiBahauddin': [32.5861, 73.4917], 'Wazirabad': [32.4414, 74.1232],
    'Kharian': [32.8110, 73.8650], 'Vehari': [30.0333, 72.3500], 'MianChannu': [30.4390, 72.3533],
    'Chichawatni': [30.5333, 72.7000],
    # Sindh
    'MirpurKhas': [25.5251, 69.0159], 'Nawabshah': [26.2483, 68.4096], 'Jacobabad': [28.2769, 68.4382],
    'Shikarpur': [27.9571, 68.6382], 'Dadu': [26.7303, 67.7769], 'TandoAdam': [25.7682, 68.6620],
    'Khairpur': [27.5295, 68.7592], 'Thatta': [24.7475, 67.9258],
    # KPK
    'Kohat': [33.5889, 71.4428], 'DeraIsmailKhan': [31.8327, 70.9015], 'Bannu': [32.9854, 70.6027],
    'Charsadda': [34.1453, 71.7308], 'Nowshera': [34.0158, 71.9812], 'Mansehra': [34.3333, 73.2000],
    'Chitral': [35.8511, 71.7864], 'Timargara': [34.8281, 71.8408],
    # Balochistan
    'Khuzdar': [27.8110, 66.6114], 'Chaman': [30.9177, 66.4526], 'Zhob': [31.3411, 69.4481],
    'Sibi': [29.5448, 67.8764], 'Loralai': [30.3705, 68.5980], 'Ormara': [25.2088, 64.6357],
    'Pasni': [25.2630, 63.4810],
    # AJK & GB
    'Mirpur': [33.1428, 73.7710], 'Rawalakot': [33.8569, 73.7634], 'Kotli': [33.5184, 73.9023],
    'Chilas': [35.4206, 74.0967], 'Hunza': [36.3167, 74.6500]
}

all_cities = {**core_cities, **extra_cities}

provinces = {
    'Gujrat': 'Punjab', 'Sheikhupura': 'Punjab', 'Jhang': 'Punjab', 'DeraGhaziKhan': 'Punjab', 
    'Kasur': 'Punjab', 'Okara': 'Punjab', 'Chiniot': 'Punjab', 'Kamoke': 'Punjab', 
    'Hafizabad': 'Punjab', 'Sadiqabad': 'Punjab', 'Burewala': 'Punjab', 'Mianwali': 'Punjab', 
    'Khanewal': 'Punjab', 'Jhelum': 'Punjab', 'Attock': 'Punjab',
    'Bhalwal': 'Punjab', 'MandiBahauddin': 'Punjab', 'Wazirabad': 'Punjab',
    'Kharian': 'Punjab', 'Vehari': 'Punjab', 'MianChannu': 'Punjab', 'Chichawatni': 'Punjab',
    
    'MirpurKhas': 'Sindh', 'Nawabshah': 'Sindh', 'Jacobabad': 'Sindh', 'Shikarpur': 'Sindh', 
    'Dadu': 'Sindh', 'TandoAdam': 'Sindh', 'Khairpur': 'Sindh', 'Thatta': 'Sindh',
    
    'Kohat': 'KPK', 'DeraIsmailKhan': 'KPK', 'Bannu': 'KPK', 'Charsadda': 'KPK', 
    'Nowshera': 'KPK', 'Mansehra': 'KPK', 'Chitral': 'KPK', 'Timargara': 'KPK',
    
    'Khuzdar': 'Balochistan', 'Chaman': 'Balochistan', 'Zhob': 'Balochistan', 
    'Sibi': 'Balochistan', 'Loralai': 'Balochistan', 'Ormara': 'Balochistan', 'Pasni': 'Balochistan',
    
    'Mirpur': 'AJK', 'Rawalakot': 'AJK', 'Kotli': 'AJK',
    'Chilas': 'Gilgit-Baltistan', 'Hunza': 'Gilgit-Baltistan'
}

# Add original provinces
original_provinces = {
    'Lahore': 'Punjab', 'Faisalabad': 'Punjab', 'Multan': 'Punjab', 'Gujranwala': 'Punjab', 
    'Sialkot': 'Punjab', 'Rawalpindi': 'Punjab', 'Bahawalpur': 'Punjab', 'Sargodha': 'Punjab', 
    'Sahiwal': 'Punjab', 'RahimYarKhan': 'Punjab',
    'Karachi': 'Sindh', 'Sukkur': 'Sindh', 'Hyderabad': 'Sindh', 'Larkana': 'Sindh',
    'Peshawar': 'KPK', 'Abbottabad': 'KPK', 'Swat': 'KPK', 'Mardan': 'KPK',
    'Islamabad': 'ICT',
    'Quetta': 'Balochistan', 'Gwadar': 'Balochistan', 'Turbat': 'Balochistan',
    'Gilgit': 'Gilgit-Baltistan', 'Skardu': 'Gilgit-Baltistan',
    'Muzaffarabad': 'AJK'
}
all_provinces = {**provinces, **original_provinces}


graph = {}
for city in all_cities:
    graph[city] = {}

# We connect each city to its 4 nearest neighbors to form a cohesive graph.
# We apply a 1.25x multiplier to Haversine to simulate road distance.
# Also ensure bidirectionality.

for city1 in all_cities:
    distances = []
    for city2 in all_cities:
        if city1 != city2:
            dist = haversine(all_cities[city1][0], all_cities[city1][1], all_cities[city2][0], all_cities[city2][1])
            distances.append((city2, dist))
    
    # Sort and pick top 4 closest
    distances.sort(key=lambda x: x[1])
    closest = distances[:4]
    
    for neighbor, dist in closest:
        road_dist = int(dist * 1.25)
        # Avoid overriding with significantly longer distances if an edge already exists
        if neighbor not in graph[city1] or graph[city1][neighbor] > road_dist:
            graph[city1][neighbor] = road_dist
        if city1 not in graph[neighbor] or graph[neighbor][city1] > road_dist:
            graph[neighbor][city1] = road_dist


# Output to cities.js in js/ directory
with open('js/cities.js', 'w', encoding='utf-8') as f:
    f.write('/* ====================================================\n')
    f.write('   SMART ROUTE FINDER — CITY DATA MODULE (EXPANDED)\n')
    f.write('   Separated from main HTML for scalability.\n')
    f.write('==================================================== */\n\n')
    
    f.write('const cities = {\n')
    for i, (city, coords) in enumerate(all_cities.items()):
        f.write(f'    {city}: [{coords[0]:.4f}, {coords[1]:.4f}]')
        if i < len(all_cities) - 1:
            f.write(',')
        f.write('\n')
    f.write('};\n\n')
    
    f.write('const graph = {\n')
    for i, (city, edges) in enumerate(graph.items()):
        f.write(f'    {city}: {{\n')
        edge_items = list(edges.items())
        for j, (neighbor, dist) in enumerate(edge_items):
            f.write(f'        {neighbor}: {dist}')
            if j < len(edge_items) - 1:
                f.write(',')
            f.write('\n')
        f.write('    }')
        if i < len(graph) - 1:
            f.write(',')
        f.write('\n')
    f.write('};\n\n')

    f.write('const cityProvinces = {\n')
    for i, (city, prov) in enumerate(all_provinces.items()):
        f.write(f'    {city}: "{prov}"')
        if i < len(all_provinces) - 1:
            f.write(',')
        f.write('\n')
    f.write('};\n')

print("js/cities.js generated successfully!")
