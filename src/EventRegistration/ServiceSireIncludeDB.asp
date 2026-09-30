<% 'if len(DueDate) > 1 then 


'response.write ("ServiceSireID =")
'response.write (ServiceSireID )

if len(ServiceSireID) > 0 and (not ServiceSireID = 0) then
			
			sqls = "select Animals.FullName, Animals.Color, Photos.ListPageImage from Animals, Photos where Animals.ID = Photos.ID and Photos.ID =" & ServiceSireID


			Set rss = Server.CreateObject("ADODB.Recordset")
			rss.Open sqls, conn, 3, 3 

			ServiceSireName = rss("FullName")
			ServiceSireColor = rss("Color")
			ServiceSireImage 	= "/uploads/ListPage/" & rss("ListPageImage")
			If Len( ServiceSireImage) < 21 Then
				ServiceSireImage = "/uploads/ListPage/NotAvailableL.jpg" 
			end If 

			rss.close
			set rss=nothing
			set conns = nothing
			sireclick = "<a href ='Details.asp?ID=" & ServiceSireID & "&DetailType=Sire&Detail.x=53&Detail.y=21' 	class = 'body'><img src='" & ServiceSireImage & "'border=0  width=115></a>"



		else if Len(ExternalStudID) > 0 and (not ExternalStudID = 0) then 
			conn6 = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
			"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
			sql6 = "select * from ExternalStud where ExternalStudID =" & ExternalStudID


'response.write(sql6)

			Set rs6 = Server.CreateObject("ADODB.Recordset")
			rs6.Open sql6, conn6, 3, 3 

			CurrentXStudID = rs6("ExternalStudID")
			ServiceSireName = rs6("AlpacaName")
			ServiceSireColor = rs6("ServiceSireColor")
			CurrentXStudLink = rs6("ServiceSireLink")
			ServiceSireARI = rs6("ARI")
			CurrentXStudImage = "/uploads/ListPage/" + rs6("ServiceSireImage")

			rs6.close
			set rs6=nothing
			set conn6 = nothing
			
			if len(CurrentXStudLink) > 1 then
				sireclick = "<a href = ""http://"& CurrentXStudLink &""" border = 0><img src ="""& CurrentXStudImage &"""  width=""115"" border = 0 ></a>"
			else
				sireclick = "<img src ="""& CurrentXStudImage &""" width=""115"" border = 0 >"
			end if



			
			end if
		end if


%>
	
				<tr>
					<td align="left" valign = "top" class = "body" ><% if not (gender = "male") then %>
						Bred To:<br>
						Due:<br>
					</td>
					<td align="left" valign = "top" class = "body" colspan ="4">
						<%=ServiceSireName%>, <%=ServiceSireARI%> (<%=ServiceSireColor%>) <br>
						<%=DueDate%><br>
					</td>
				</tr>


<%end if%>

