<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bordercolor = "" align = "center" width = "800">
	<tr>
		<td class = "body">
			<h2><font color = "brown">Step 1: Basic Facts</font> <small>(* = Required Fields)</small></h2><br>
		
		</td>
	</tr>
	</table>
	<table>
	<tr>
		<td>
<form  name=form method="post" action="AddanAlpaca2.asp">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
			<tr>
				<td width = "300"  class = "body">	
					Full Name:*
				</td>
				<td class = "body" width = "250"  >
					ARI# (US reg.):
				</td>
				<td class = "body" width = "250" >
					CLAA# (Canadian reg.):
				</td>
			</tr>
			<tr>
				<td>
					<input name="Name" size = "40" value = "<%=Fullname%>">
				</td>
				<td>
					<input name="ARI" size = "20" value = "<%=ARI%>">
				</td>
				<td>
					<input name="CLAA" size = "20" value = "<%=CLAA%>">
				</td>
			</tr>
		</table>
<table>
	<tr>
		<td class = "body" width = "200">
			Date of Birth:
		</td>
		
		<td class = "body" width = "300">
			Category:*
		</td>
		<td class = "body" width = "300">
			Breed:*
		</td>
	</tr>
	<tr>
		<td>
				<select size="1" name="DOBMonth">
					<option value="<%=DOBMonth%>" selected><%=DOBMonth%></option>
					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
				</select>
				<select size="1" name="DOBDay">
					<option value="<%=DOBday%>" selected><%=DOBday%></option>
					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>
		<select size="1" name="DOBYear">
					<option value="<%=DOBYear%>" selected><%=DOBYear%></option>
					
				
			<% currentyear = year(date) 
						response.write(currentyear)
					For yearv=1983 To currentyear %>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		</td>
		
		<td>
			<select size="1" name="Category">
					<option name = "Category2" value= "<%=Category%>" selected><%=Category%></option>
					<option name = "Category12" value="Herdsire">Herdsire <small>(has had at least one offspring)</small></option>
					<option name = "Category11" value="Jr. Herdsire">Jr. Herdsire <small>(gotten at least one Dam pregnant)</small></option>
				 	<option name = "Category12" value="JuvenileMale">Juvenile Male <small>(never gotten a Dam pregnant)</small></option>
				     <option name = "Category14" value="Dam">Dam <small>(has been pregnant at least once.)</small></option>
					 <option name = "Category13" value="Maiden">Maiden <small>(has never been pregnant)</small></option>
				     <option name = "Category15" value="Non-Breeder">Fiber/Companion</option>
					</select>
		</td>
		<td>
			<select size="1" name="Breed">
					<option name = "Breed2" value= "" selected></option>
					<option name = "Breed3" value="Huacaya">Huacaya</option>
					<option name = "Breed11" value="Suri">Suri</option>
					</select>
		</td>
	</tr>
</table>
<table>
	<tr>
		<td class = "body" width = "160">
			Color 1:
		</td>
		<td class = "body" width = "160">
			Color 2:
		</td>
		<td class = "body" width = "160">
			Color 3:
		</td>
		<td class = "body" width = "160">
			Color 4:
		</td>
			<td class = "body" width = "160">
			Color 5:
		</td>
	</tr>
	<tr>
		<td>
			<select size="1" name="Color1">
					<option name = "color1a" value= "" selected><%=Color1%></option>
					<option name = "color1b" value="White">White</option>
					<option name = "color1c" value="Beige">Beige</option>
					<option name = "color1d" value="Light Fawn">Light Fawn</option>
					<option name = "color1e" value="Medium Fawn">Medium Fawn</option>
					<option name = "color1f" value="Dark Fawn">Dark Fawn</option>
					<option name = "color1g" value="Light Brown">Light Brown</option>
					<option name = "color1h" value="Medium Brown">Medium Brown</option>
					<option name = "color1i" value="Dark Brown">Dark Brown</option>
					<option name = "color1j" value="Light Silver Grey">Light Silver Grey</option>
					<option name = "color1k" value="Medium Silver Grey">Medium Silver Grey</option>
					<option name = "color1l" value="Dark Silver Grey">Dark Silver Grey</option>
					<option name = "color1m" value="Light Rose Grey">Light Rose Grey</option>
					<option name = "color1n" value="Medium Rose Grey">Medium Rose Grey</option>
					<option name = "color1o" value="Dark Rose Grey">Dark Rose Grey</option>
					<option name = "color1p" value="Bay Black">Bay Black</option>
					<option name = "color1q" value="True Black">True Black</option>
					</select>
		</td>
		<td>
				<select size="1" name="Color2">
					<option name = "color2a" value= "" selected><%=Color2%></option>
					<option name = "color2b" value="White">White</option>
					<option name = "color2c" value="Beige">Beige</option>
					<option name = "color2d" value="Light Fawn">Light Fawn</option>
					<option name = "color2e" value="Medium Fawn">Medium Fawn</option>
					<option name = "color2f" value="Dark Fawn">Dark Fawn</option>
					<option name = "color2g" value="Light Brown">Light Brown</option>
					<option name = "color2h" value="Medium Brown">Medium Brown</option>
					<option name = "color2i" value="Dark Brown">Dark Brown</option>
					<option name = "color2j" value="Light Silver Grey">Light Silver Grey</option>
					<option name = "color2k" value="Medium Silver Grey">Medium Silver Grey</option>
					<option name = "color2l" value="Dark Silver Grey">Dark Silver Grey</option>
					<option name = "color2m" value="Light Rose Grey">Light Rose Grey</option>
					<option name = "color2n" value="Medium Rose Grey">Medium Rose Grey</option>
					<option name = "color2o" value="Dark Rose Grey">Dark Rose Grey</option>
					<option name = "color2p" value="Bay Black">Bay Black</option>
					<option name = "color2q" value="True Black">True Black</option>
					</select>
		</td>
		<td>
			<select size="1" name="Color3">
					<option name = "color3a" value= "" selected><%=Color3%></option>
					<option name = "color3b" value="White">White</option>
					<option name = "color3c" value="Beige">Beige</option>
					<option name = "color3d" value="Light Fawn">Light Fawn</option>
					<option name = "color3e" value="Medium Fawn">Medium Fawn</option>
					<option name = "color3f" value="Dark Fawn">Dark Fawn</option>
					<option name = "color3g" value="Light Brown">Light Brown</option>
					<option name = "color3h" value="Medium Brown">Medium Brown</option>
					<option name = "color3i" value="Dark Brown">Dark Brown</option>
					<option name = "color3j" value="Light Silver Grey">Light Silver Grey</option>
					<option name = "color3k" value="Medium Silver Grey">Medium Silver Grey</option>
					<option name = "color3l" value="Dark Silver Grey">Dark Silver Grey</option>
					<option name = "color3m" value="Light Rose Grey">Light Rose Grey</option>
					<option name = "color3n" value="Medium Rose Grey">Medium Rose Grey</option>
					<option name = "color3o" value="Dark Rose Grey">Dark Rose Grey</option>
					<option name = "color3p" value="Bay Black">Bay Black</option>
					<option name = "color3q" value="True Black">True Black</option>
					</select>
		</td>
		<td>
			<select size="1" name="Color4">
					<option name = "color4a" value= "" selected><%=Color4%></option>
					<option name = "color4b" value="White">White</option>
					<option name = "color4c" value="Beige">Beige</option>
					<option name = "color4d" value="Light Fawn">Light Fawn</option>
					<option name = "color4e" value="Medium Fawn">Medium Fawn</option>
					<option name = "color4f" value="Dark Fawn">Dark Fawn</option>
					<option name = "color4g" value="Light Brown">Light Brown</option>
					<option name = "color4h" value="Medium Brown">Medium Brown</option>
					<option name = "color4i" value="Dark Brown">Dark Brown</option>
					<option name = "color4j" value="Light Silver Grey">Light Silver Grey</option>
					<option name = "color4k" value="Medium Silver Grey">Medium Silver Grey</option>
					<option name = "color4l" value="Dark Silver Grey">Dark Silver Grey</option>
					<option name = "color4m" value="Light Rose Grey">Light Rose Grey</option>
					<option name = "color4n" value="Medium Rose Grey">Medium Rose Grey</option>
					<option name = "color4o" value="Dark Rose Grey">Dark Rose Grey</option>
					<option name = "color4p" value="Bay Black">Bay Black</option>
					<option name = "color4q" value="True Black">True Black</option>
					</select>
		</td>
		<td>
			<select size="1" name="Color5">
					<option name = "color5a" value= "" selected><%=Color5%></option>
					<option name = "color5b" value="White">White</option>
					<option name = "color5c" value="Beige">Beige</option>
					<option name = "color5d" value="Light Fawn">Light Fawn</option>
					<option name = "color5e" value="Medium Fawn">Medium Fawn</option>
					<option name = "color5f" value="Dark Fawn">Dark Fawn</option>
					<option name = "color5g" value="Light Brown">Light Brown</option>
					<option name = "color5h" value="Medium Brown">Medium Brown</option>
					<option name = "color5i" value="Dark Brown">Dark Brown</option>
					<option name = "color5j" value="Light Silver Grey">Light Silver Grey</option>
					<option name = "color5k" value="Medium Silver Grey">Medium Silver Grey</option>
					<option name = "color5l" value="Dark Silver Grey">Dark Silver Grey</option>
					<option name = "color5m" value="Light Rose Grey">Light Rose Grey</option>
					<option name = "color5n" value="Medium Rose Grey">Medium Rose Grey</option>
					<option name = "color5o" value="Dark Rose Grey">Dark Rose Grey</option>
					<option name = "color5p" value="Bay Black">Bay Black</option>
					<option name = "color5q" value="True Black">True Black</option>
					</select>
		</td>
	</tr>
</table>
<table>
	<tr>
		<td class = "body" width = "160">
			% Peruvian:
		</td>
		<td class = "body" width = "160">
			% Chilean:
		</td>
		<td class = "body" width = "160">
			% Bolivian:
		</td>
		<td class = "body" width = "160">
			% Other/Unknown:
		</td>
			<td class = "body" width = "160">
			% Accoyo
		</td>
	</tr>
	<tr>
		<td>
		<select size="1" name="PercentPeruvian">
					<option name = "PercentPeruvian1" value= "" selected><%=PercentPeruvian%></option>
					<option name = "PercentPeruvian2" value="0">0%</option>
					<option name = "PercentPeruvian3" value="1/8">1/8</option>
				     <option name = "PercentPeruvian4" value="1/4">1/4</option>
				     <option name = "PercentPeruvian5" value="3/8">3/8</option>
				     <option name = "PercentPeruvian6" value="1/2">1/2</option>
				     <option name = "PercentPeruvian7" value="5/8">5/8</option>
				     <option name = "PercentPeruvian8" value="3/4">3/4</option>
				     <option name = "PercentPeruvian9" value="7/8">7/8</option>
					  <option name = "PercentPeruvian10" value="FullPeruvian">Full Peruvian</option>
			 </select>
		</td>
		<td>
				<select size="1" name="PercentChilean">
					<option name = "PercentChilean1" value= "" selected><%=PercentChilean%></option>
					<option name = "PercentChilean2" value="0">0%</option>
					<option name = "PercentChilean3" value="1/8">1/8</option>
				     <option name = "PercentChilean4" value="1/4">1/4</option>
				     <option name = "PercentChilean5" value="3/8">3/8</option>
				     <option name = "PercentChilean6" value="1/2">1/2</option>
				     <option name = "PercentChilean7" value="5/8">5/8</option>
				     <option name = "PercentChilean8" value="3/4">3/4</option>
				     <option name = "PercentChilean9" value="7/8">7/8</option>
					  <option name = "PercentChilean10" value="FullChilean">Full Chilean</option>
			 </select>
			
		</td>
		<td>
			<select size="1" name="PercentBolivian">
					<option name = "PercentBolivian1" value= "" selected><%=PercentBolivian%></option>
					<option name = "PercentBolivian2" value="0">0%</option>
					<option name = "PercentBolivian3" value="1/8">1/8</option>
				     <option name = "PercentBolivian4" value="1/4">1/4</option>
				     <option name = "PercentBolivian5" value="3/8">3/8</option>
				     <option name = "PercentBolivian6" value="1/2">1/2</option>
				     <option name = "PercentBolivian7" value="5/8">5/8</option>
				     <option name = "PercentBolivian8" value="3/4">3/4</option>
				     <option name = "PercentBolivian9" value="7/8">7/8</option>
					  <option name = "PercentBolivian10" value="FullBolivian">Full Bolivian</option>
			 </select>
		</td>
		<td>
			<select size="1" name="PercentUnknownOther">
					<option name = "PercentUnknownOther1" value= "" selected><%=PercentUnknownOther%></option>
					<option name = "PercentUnknownOther2" value="0">0%</option>
					<option name = "PercentUnknownOther3" value="1/8">1/8</option>
				     <option name = "PercentUnknownOther4" value="1/4">1/4</option>
				     <option name = "PercentUnknownOther5" value="3/8">3/8</option>
				     <option name = "PercentUnknownOther6" value="1/2">1/2</option>
				     <option name = "PercentUnknownOther7" value="5/8">5/8</option>
				     <option name = "PercentUnknownOther8" value="3/4">3/4</option>
				     <option name = "PercentUnknownOther9" value="7/8">7/8</option>
					  <option name = "PercentUnknownOther10" value="FullPeruvian">100% Unknown or Other</option>
			 </select>
		</td>
		<td>
			<select size="1" name="PercentAccoyo">
					<option name = "PercentAccoyo1" value= "" selected><%=PercentAccoyo%></option>
					<option name = "PercentAccoyo2" value="0">0%</option>
					<option name = "PercentAccoyo3" value="1/8">1/8</option>
				     <option name = "PercentAccoyo4" value="1/4">1/4</option>
				     <option name = "PercentAccoyo5" value="3/8">3/8</option>
				     <option name = "PercentAccoyo6" value="1/2">1/2</option>
				     <option name = "PercentAccoyo7" value="5/8">5/8</option>
				     <option name = "PercentAccoyo8" value="3/4">3/4</option>
				     <option name = "PercentAccoyo9" value="7/8">7/8</option>
					  <option name = "PercentAccoyo10" value="FullAccoyo">Full Accoyo</option>
			 </select>
		</td>
	</tr>
</table>
<table width = "800">
	
<tr>
	<td  align = "center">
		<input type=button value="Submit" onclick="verify();">
	</form>

		</td>
</tr>
</table>
				
					
                		
