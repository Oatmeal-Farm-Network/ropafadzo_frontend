<% if len(DueDate) > 1 then 

if len(ServiceSireID) > 0 and (not ServiceSireID = 0) then
			
			sqls = "select Animals.FullName, Animals.*, colors.*, Photos.* from Animals, Photos, Colors where Animals.ID =  colors.ID and  Animals.ID = Photos.ID and animals.ID =" & ServiceSireID
response.write(sqls)
			Set rss = Server.CreateObject("ADODB.Recordset")
			rss.Open sqls, conn, 3, 3 

			ServiceSireName = rss("FullName")
			ServiceSireColor = rss("Color")
			ServiceSireImage 	= "/uploads/ListPage/" & rss("ListPageImage")
			If Len( ServiceSireImage) < 21 Then
				ServiceSireImage = "/uploads/ListPage/NotAvailable.jpg" 
			end If 

			rss.close
			set rss=nothing
			set conns = nothing
			sireclick = "<a href ='StudDetails.asp?ID=" & ServiceSireID & "&DetailType=Sire' 	class = 'body'><img src='" & ServiceSireImage & "'border=0  width=115></a>"
			sirenameclick = "<a href ='StudDetails.asp?ID=" & ServiceSireID & "&DetailType=Sire' 	class = 'body' >" & ServiceSireName & "</a>"



		else if Len(ExternalStudID) > 0 or (not ExternalStudID = 0) then 

			conn6 = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
			"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
			sql6 = "select * from ExternalStud where ExternalStudID =" & ExternalStudID

			Set rs6 = Server.CreateObject("ADODB.Recordset")
			rs6.Open sql6, conn6, 3, 3 

			CurrentXStudID = rs6("ExternalStudID")
			ServiceSireName = rs6("AlpacaName")
			ServiceSireColor = rs6("ServiceSireColor")
			CurrentXStudLink = rs6("ServiceSireLink")
			CurrentXStudARI = rs6("ARI")
			CurrentXStudImage = "/uploads/ListPage/" + rs6("ServiceSireImage")

			rs6.close
			set rs6=nothing
			set conn6 = nothing
			
			if len(CurrentXStudLink) > 1 then
				sireclick = "<a href = ""http://"& CurrentXStudLink &""" border = 0 target = 'blank'><img src ="""& CurrentXStudImage &"""  width=""115"" border = 0 ></a>"
				sirenameclick = "<a href = ""http://"& CurrentXStudLink &""" border = 0 class = 'body' target = 'blank'>" & ServiceSireName & "</a>"

			else
				sireclick = "<img src ="""& CurrentXStudImage &""" width=""115"" border = 0 >"
				sirenameclick =  ServiceSireName 
			end if



			
			end if
		end if


%>
<table border="0" cellspacing="2" align = "center" >
	
				<tr>
					<td align="center" valign = "top" class = "body"><% if not (gender = "male") then %>
					<br><h2>Service Sire<br><img src = "images/line.jpg" width = "270" height = "3"></h2>					
						<table valign="top">
							<tr>
								<td><table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 style="border-style: ridge; border-color: #811c35; border-right-width: 3; border-left-width: 2; border-top-width: 2; border-bottom-width: 3" ><tr><td><%= sireclick%></td></tr></table>
								</td>
								<td  valign="top"  class = "body">
									<%=sirenameclick%><br>
								
								Color: <%=ServiceSireColor%><br>
								ARI#: <%=CurrentXStudARI%><br>
								Due: <%=DueDate%><br>
								
							</td>
						</tr>
						
					</table>
					</td>
				</tr>
</table>

<%end if%>
<%end if%>
